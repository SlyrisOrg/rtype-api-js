export default (deps) => {
  // ////// //
  // DOTENV //
  // ////// //

  deps.dotenv.config();

  // /////// //
  // HELPERS //
  // /////// //

  const verify = (configs) => {
    const errors = configs.filter(config => typeof config === 'undefined');

    if (errors.lenght) {
      throw new Error(`Error in configurations: ${errors}`);
    }

    return configs;
  };

  // /////////////////// //
  // BASE CONFIGURATIONS //
  // /////////////////// //

  const server = verify({
    env: process.env.NODE_ENV,
    production: process.env.NODE_ENV === 'production',
    port: process.env.PORT,
    locale: process.env.LOCALE,
    server: process.env.SECRET,
    ssl: {
      key: process.env.SSL_KEY,
      cert: process.env.SSL_CERTIFICAT,
    },
  });

  // /////////////////////// //
  // DATABASE CONFIGURATIONS //
  // /////////////////////// //

  const database = verify({
    mongo: {
      uri: process.env.MONGO_URI,
      collections: {
        users: process.env.MONGO_USERS_COLLECTION,
      },
    },
  });

  const model = {
    user: {
      email: { type: String, unique: true },
      password: String,
      passwordResetToken: String,
      passwordResetExpires: Date,

      facebook: String,
      twitter: String,
      google: String,
      tokens: Array,

      profile: {
        name: String,
        gender: String,
        location: String,
      },
    },
  };

  return {
    server,
    database,
    model,
  };
};
