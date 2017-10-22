// ////////////// //
// SERVER MODULES //
// ////////////// //

import http from 'http';

// //////////////// //
// INTERNAL MODULES //
// //////////////// //

import path from 'path';

// //////////////// //
// EXTERNAL MODULES //
// //////////////// //

import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import winston from 'winston';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import passport from 'passport';
import passportLocal from 'passport-local';
import passportJwt from 'passport-jwt';
import dotenv from 'dotenv';
import expressValidator from 'express-validator';

// ///////////// //
// TIERS MODULES //
// ///////////// //

import configModule from './modules/config';
import loggerModule from './modules/logger';
import userModule from './modules/user';

// /////////// //
// CONTROLLERS //
// /////////// //

import userController from './controllers/user';

// ////// //
// MODELS //
// ////// //

import userModel from './models/user';

// //////////////// //
// INITIALS MODULES //
// //////////////// //

const config = configModule({
  dotenv,
}, {
  payload: {
    system: {
      notFound: { id: 7, name: 'NOT_FOUND' },
      internalError: { id: 2, name: 'INTERNAL_ERROR' },
      unvalidSignature: { id: 12, name: 'UNVALID_SIGNATURE' },
      unvalidToken: { id: 13, name: 'UNVALID_TOKEN' },
    },
    input: {
      name: {
        empty: { id: 3, name: 'USER_NAME_EMPTY' },
        badFormat: { id: 4, name: 'USER_NAME_BAD_FORMAT' },
      },
      email: {
        empty: { id: 10, name: 'USER_EMAIL_EMPTY' },
        badFormat: { id: 11, name: 'USER_EMAIL_BAD_FORMAT' },
      },
      password: {
        empty: { id: 6, name: 'USER_PASSWORD_EMPTY' },
        badFormat: { id: 5, name: 'USER_PASSWORD_BAD_FORMAT' },
      },
    },
    user: {
      data: {
        get: {
          success: { id: 15, name: 'USER_GET_DATA_SUCCESS' },
          fail: { id: 16, name: 'USER_GET_DATA_FAIL' },
        },
        put: {
          success: { id: 17, name: 'USER_PUT_DATA_SUCCESS' },
          fail: { id: 18, name: 'USER_PUT_DATA_FAIL' },
        },
        post: {
          success: { id: 19, name: 'USER_POST_DATA_SUCCESS' },
          fail: { id: 20, name: 'USER_POST_DATA_FAIL' },
        },
      },
      signin: {
        success: { id: 0, name: 'USER_SIGIN_SUCCESS' },
        fail: { id: 1, name: 'USER_SIGIN_FAIL' },
      },
      signup: {
        success: { id: 7, name: 'USER_SIGNUP_SUCCESS' },
        fail: { id: 9, name: 'USER_SIGNUP_FAIL' },
      },
    },
  },
});

const logger = loggerModule({
  winston,
}, config);

// ////////////////////// //
// MONGOOSE CONFIGURATION //
// ////////////////////// //

mongoose.Promise = Promise;
mongoose.connect(config.database.mongo.uri, { useMongoClient: true });

// ////// //
// MODELS //
// ////// //

const User = userModel({ mongoose, bcrypt });

// ////////////////////// //
// PASSPORT CONFIGURATION //
// ////////////////////// //

userModule({
  passport,
  passportLocal,
  passportJwt,
}, {
  User,
}, config);

// /////////// //
// APPLICATION //
// /////////// //

const app = express();

// /////////////// //
// SECURITY LAYERS //
// /////////////// //

app.use(helmet());
app.use(async (req, res, next) => {
  const signature = req.headers['x-hub-signature'];

  if (!config.server.production) {
    next();
    return;
  }

  if (signature) {
    const elements = signature.split('=');
    const password = elements[1] || signature;
    const isMatch = await bcrypt.compare(password, config.server.signature);

    if (isMatch) {
      next();
      return;
    }
  }

  res.json({
    success: false,
    payload: config.payload.system.unvalidSignature,
  });
});
app.use(morgan('combined', { stream: { write: message => logger.info(message) } }));
app.use(passport.initialize());

// ///////////// //
// PARSER LAYERS //
// ///////////// //

app.use(bodyParser.urlencoded({ extended: true, defer: true }));
app.use(bodyParser.json({ type: '*/*' }));

// ///////////// //
// ERROR CATCHER //
// ///////////// //

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError) {
    logger.error('Bad format request');
  } else {
    next();
  }
});

// ///////////// //
// HELPER LAYERS //
// ///////////// //

app.use(expressValidator());
app.use((req, res, next) => {
  logger.debug(req.body);
  next();
});
app.use((req, res, next) => {
  const chunks = [];

  const oldWrite = res.write;
  res.write = function write(chunk, ...args) {
    chunks.push(chunk);

    oldWrite.apply(res, [chunk, args]);
  };

  const oldEnd = res.end;
  res.end = function end(chunk, ...args) {
    if (chunk) {
      chunks.push(chunk);
    }

    const body = Buffer.concat(chunks).toString('utf8');
    logger.debug(JSON.parse(body));

    oldEnd.apply(res, [chunk, args]);
  };

  next();
});

// /////////////// //
// STATIC ENDPOINT //
// /////////////// //

app.use('/', express.static(path.resolve(process.cwd(), 'public')));

// /////////////////// //
// CONTROLLER ENDPOINT //
// /////////////////// //

app.use('/api/user', userController({
  passport,
  logger,
  jwt,
}, {
  User,
}, config)(express.Router()));

// //////////////// //
// DEFAULT ENDPOINT //
// //////////////// //

app.use('*', (req, res) => {
  res.json({
    success: false,
    payload: config.payload.system.notFound,
  });
});

// ////////////////////// //
// SERVER EVENTS LISTENER //
// ////////////////////// //

const onStartEvent = () =>
  logger.info(`Application launched on ${config.server.env}`);

const onErrorEvent = (err) => {
  if (err.syscall !== 'listen') {
    throw new Error(err);
  }

  const bind = typeof config.server.port === 'string'
    ? `Pipe ${config.server.port}`
    : `Port ${config.server.port}`;

  switch (err.code) {
    case 'EACCES':
      throw new Error(`${bind} port requires elevated privileges`);
    case 'EADDRINUSE':
      throw new Error(`${bind} port is already in use`);
    default:
      throw err;
  }
};

const onListenEvent = server => () => {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  logger.info(`Application listening on ${bind}`);
};

// /////////////// //
// SERVER INSTANCE //
// /////////////// //

const server = http.createServer(app);

server.listen(config.server.port, onStartEvent);
server.on('err', onErrorEvent);
server.on('listening', onListenEvent(server));

// /////////////////// //
// HANDLE PROCESS EXIT //
// /////////////////// //

const cleanExit = () => {
  logger.info('Application exit');
  process.exit(0);
};

process.on('SIGINT', cleanExit);
process.on('SIGTERM', cleanExit);

// ////////////////////// //
// HANDLE PROCESS FAILURE //
// ////////////////////// //

process.on('uncaughtException', (err) => {
  logger.error(`Caught exception: ${err}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason, p) => {
  logger.error(`Unhandled Rejection at: ${p} and reason: ${reason}`);
  process.exit(1);
});

export default app;
