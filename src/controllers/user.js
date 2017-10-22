const signin = (deps, models, configs) => async (req, res, next) => {
  req.assert('pseudo', configs.payload.format.pseudo.empty).notEmpty();
  req.assert('pseudo', configs.payload.format.pseudo.badFormat).isLength({ min: 3, max: 20 });
  req.assert('pseudo', configs.payload.format.pseudo.badFormat).isAlphanumeric();

  req.assert('password', configs.payload.format.password.empty).notEmpty();
  req.assert('password', configs.payload.format.password.badFormat).isLength({ min: 4, max: 16 });

  const errors = req.validationErrors();

  if (errors.length) {
    const allErrors = errors.map(e => e.msg);

    res.json({
      success: false,
      payload: allErrors[0],
    });
    return;
  }

  deps.passport.authenticate('local', { session: false }, (err, user) => {
    if (err) {
      res.json({
        success: false,
        payload: configs.payload.system.internalError,
      });
      return;
    }

    if (!user) {
      res.json({
        success: false,
        payload: configs.payload.user.signin.fail,
      });
      return;
    }

    res.json({
      success: true,
      payload: configs.payload.user.signin.success,
      content: {
        new: user.new,
        token: deps.jwt.sign({
          id: user._id,
        }, configs.server.secret, {
          expiresIn: 48 * 60 * 60,
        }),
        user: user.profile,
      },
    });
  })(req, res, next);
};

const signup = (deps, models, configs) => async (req, res) => {
  req.assert('pseudo', configs.payload.format.pseudo.empty).notEmpty();
  req.assert('pseudo', configs.payload.format.pseudo.badFormat).isLength({ min: 3, max: 20 });
  req.assert('pseudo', configs.payload.format.pseudo.badFormat).isAlphanumeric();

  req.assert('password', configs.payload.format.password.empty).notEmpty();
  req.assert('password', configs.payload.format.password.badFormat).isLength({ min: 4, max: 16 });

  req.assert('email', configs.payload.format.email.empty).notEmpty();
  req.assert('email', configs.payload.format.email.badFormat).isEmail();
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors.length) {
    const allErrors = errors.map(e => e.msg);

    res.json({
      success: false,
      payload: allErrors[0],
    });
    return;
  }

  const user = new models.User({
    pseudo: req.body.pseudo,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    const existingUser = await models.User.findOne({
      $or: [
        { pseudo: req.body.pseudo },
        { email: req.body.email },
      ],
    });

    if (existingUser) {
      res.json({
        success: false,
        payload: configs.payload.user.signin.fail,
      });
      return;
    }

    await user.save();
    res.json({
      success: true,
      payload: configs.payload.user.signin.success,
    });
  } catch (err) {
    deps.logger.error(`Register failure: ${err}`);
    res.json({
      success: false,
      payload: configs.payload.system.internalError,
    });
  }
};

const getUserData = (deps, models, configs) => (req, res, next) => {
  deps.passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      res.json({
        success: false,
        payload: configs.payload.system.internalError,
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
  router.get('/', getUserData(deps, models, configs));
  router.post('/signin', signin(deps, models, configs));
  router.post('/signup', signup(deps, models, configs));
  return router;
};
