const signin = (deps, models, configs) => async (req, res, next) => {
  deps.passport.authenticate('local', { session: false }, (err, user) => {
    if (err) {
      res.json({
        success: false,
        payload: configs.payload.internalError,
      });
      return;
    }

    if (!user) {
      res.json({
        success: false,
        payload: configs.payload.userSigninFail,
      });
      return;
    }

    res.json({
      success: true,
      payload: configs.payload.userSigninSuccess,
      content: {
        token: deps.jwt.sign({
          id: user._id,
        }, configs.server.secret, {
          expiresIn: 48 * 60 * 60,
        }),
      },
    });
  })(req, res, next);
};

const signup = (deps, models, configs) => async (req, res) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len({ min: 4 });
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors.length) {
    res.json({
      success: false,
      payload: configs.payload.badFormat,
    });
    return;
  }

  const user = new models.User({
    email: req.body.email,
    password: req.body.password,
  });

  try {
    const existingUser = await models.User.findOne({ email: req.body.email });
    if (existingUser) {
      res.json({
        success: false,
        payload: configs.payload.userSignupFail,
      });
      return;
    }

    await user.save();
    res.json({
      success: true,
      payload: configs.payload.userSignupSuccess,
    });
  } catch (err) {
    deps.logger.error(`Register failure: ${err}`);
    res.json({
      success: false,
      payload: configs.payload.internalError,
    });
  }
};

const getUserData = (deps, models, configs) => (req, res, next) => {
  deps.passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      res.json({
        success: false,
        payload: configs.payload.internalError,
      });
      return;
    }

    res.json({
      success: true,
      content: user,
    });
  })(req, res, next);
};

export default (deps, models, configs) => (router) => {
  router.post('/signin', signin(deps, models, configs));
  router.post('/signup', signup(deps, models, configs));
  router.post('/', getUserData(deps, models, configs));
  return router;
};
