export default (deps) => {
  // ////// //
  // DOTENV //
  // ////// //

  deps.dotenv.config();

  // /////// //
  // HELPERS //
  // /////// //

  const envConfigs = ['development', 'test', 'production'];

  const normalizePort = (config) => {
    const port = parseInt(config, 10);

    if (isNaN(port)) {
      return config;
    }

    if (port >= 0) {
      return port;
    }

    return undefined;
  };

  const normalizeEnv = (config) => {
    const error = config.find(element =>
      !!envConfigs.includes(element));

    if (!error) {
      return config;
    }

    return undefined;
  };

  const normalizeLocal = config =>
    config.length === 2;

  const normalizeFile = (config) => {
    if (deps.fs.existsSync(config.key) && deps.fs.existsSync(config.cert)) {
      return config;
    }
    return undefined;
  };

  const verify = (configs) => {
    const errors = configs.filter(config => typeof config === 'undefined');

    if (errors.lenght) {
      return configs;
    }

    throw new Error(`Error in configurations: ${errors}`);
  };

  // /////////////////// //
  // BASE CONFIGURATIONS //
  // /////////////////// //

  const server = verify({
    env: normalizeEnv(process.env.NODE_ENV),
    production: process.env.NODE_ENV === envConfigs[2],
    port: normalizePort(process.env.PORT),
    locale: normalizeLocal(process.env.LOCALE),
    server: process.env.SECRET,
    ssl: {
      key: normalizeFile(process.env.SSL_KEY),
      cert: normalizeFile(process.env.SSL_CERTIFICAT),
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
