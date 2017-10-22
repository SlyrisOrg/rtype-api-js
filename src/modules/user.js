export default (deps, models) => {
  deps.passport.use(new deps.passportLocal.Strategy({
    "usernameField": "name",
    "passwordField": "password",
    "session": false
  }, async (name, password, done) => {
    try {
      const user = await models.User.findOne({ name });

      if (!user) {
        done(null, false);
        return;
      }

      const isMatch = await user.verifyPassword(password);
      if (isMatch) {
        done(null, user);
        return;
      }

      done(null, false);
    } catch (err) {
      done(err, false);
    }
  }));
};
