export default (deps, models, configs) => {
  deps.passport.use(new deps.passportLocal.Strategy({
    "usernameField": "name",
    "passwordField": "password",
    "session": false
  }, async (name, password, done) => {
    try {
      const db = await deps.database();
      const col = await db.collection(configs.database.mongo.collection.user);

      const databaseUser = await col.findOne({ name });
      const user = new models.User(databaseUser);

      if (!user) {
        done("Unmatch user", null);
        return;
      }

      const isMatch = await user.verifyPassword(password);
      if (isMatch) {
        done(null, user);
        return;
      }

      done(null, null);
    } catch (err) {
      done(err, null);
    }
  }));
};
