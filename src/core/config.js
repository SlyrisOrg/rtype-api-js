export default (deps, configs) => {
  // ////// //
  // DOTENV //
  // ////// //

  deps.dotenv.config();

  // /////// //
  // HELPERS //
  // /////// //

  const verify = (configsToVerify) => {
    const errors = Object.keys(configsToVerify)
      .filter(configIndex => typeof configsToVerify[configIndex] === 'undefined');

    if (errors.lenght) {
      throw new Error(`Error in configurations: ${errors}`);
    }

    return configsToVerify;
  };

  // /////////////////// //
  // BASE CONFIGURATIONS //
  // /////////////////// //

  const server = verify({
    env: process.env.NODE_ENV,
    production: process.env.NODE_ENV === 'production',
    port: process.env.PORT,
    locale: process.env.LOCALE,
    secret: process.env.SECRET,
    auth: process.env.AUTH,
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

  // /////////////////////// //
  // PAYLOADS CONFIGURATIONS //
  // /////////////////////// //

  const payload = verify(configs.payload);

  return {
    server,
    database,
    payload,
  };
};
