const postSignin = (deps, modules) => (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    return;
  }

  deps.passport.authenticate('local', async (err, user) => {
    if (err) {
      return;
    }

    if (!user) {
      return;
    }

    try {
      await deps.util.promisify(req.logIn)(user);
    } catch (err) {
      modules.logger.error(`Login failure: ${err}`);
    }
  })(req, res, next);
};

const postSignup = (deps, modules, models) => async (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len({ min: 4 });
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    return;
  }

  const user = new models.User({
    email: req.body.email,
    password: req.body.password,
  });

  try {
    const existingUser = await deps.util.promisify(models.User.findOne)({ email: req.body.email });

    if (existingUser) {
      return;
    }

    await deps.util.promisify(user.save);
    await deps.util.promisify(req.logIn)(user);
  } catch (err) {
    modules.logger.error(`Register failure: ${err}`);
  }
};

export default (deps, modules, models) => (router) => {
  router.post('/signin', postSignin(deps, modules));
  router.post('/signup', postSignup(deps, modules, models));
  return router;
};
