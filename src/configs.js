import fs from 'fs';

import _ from 'lodash';
import dotenv from 'dotenv';

// ////// //
// DOTENV //
// ////// //

dotenv.config();

// /////// //
// HELPERS //
// /////// //

const envConfigs = ['development', 'test', 'production'];

const normalizePort = (config) => {
  const port = _.parseInt(config, 10);

  if (_.isNaN(port)) {
    return config;
  }

  if (port >= 0) {
    return port;
  }

  return undefined;
};

const normalizeEnv = (config) => {
  const error = _.find(config, element =>
    !!_.includes(envConfigs, element));

  if (!error) {
    return config;
  }

  return undefined;
};

const normalizeLocal = config =>
  config.length === 2;

const normalizeFile = (config) => {
  if (fs.existsSync(config.key) && fs.existsSync(config.cert)) {
    return config;
  }
  return undefined;
};

const verify = (configs) => {
  const errors = _.filter(configs, config =>
    _.isUndefined(config) || _.isNull(config));

  if (_.isEmpty(errors)) {
    return configs;
  }

  throw new Error(`Error in configurations: ${errors}`);
};

// /////////////////// //
// BASE CONFIGURATIONS //
// /////////////////// //

export const server = verify({
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

export const database = verify({
  mongo: {
    uri: process.env.MONGO_URI,
    collections: {
      users: process.env.MONGO_USERS_COLLECTION,
    },
  },
});

export const model = {
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
