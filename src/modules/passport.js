export default (deps, models, configs) => {
  deps.passport.use(new deps.passportLocal.Strategy({
    usernameField: 'email',
  }, async (email, password, done) => {
    try {
      const user = await models.User.findOne({ email: email.toLowerCase() });
      if (!user) {
        done(undefined, false, { message: `Email ${email} not found.` });
        return;
      }

      const isMatch = await user.verifyPassword(password);
      if (isMatch) {
        done(undefined, user);
        return;
      }

      done(undefined, false, { message: 'Invalid email or password.' });
    } catch (err) {
      done(err, false);
    }
  }));

  deps.passport.use(new deps.passportJwt.Strategy({
    jwtFromRequest: deps.passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: configs.server.secret,
  }, async (jwtPayload, done) => {
    try {
      const user = await models.User.findOne({ id: jwtPayload.sub });

      if (user) {
        done(null, user);
        return;
      }

      done(null, false);
    } catch (err) {
      done(err, false);
    }
  }));
};
