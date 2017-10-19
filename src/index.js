// ////////////// //
// SERVER MODULES //
// ////////////// //

import http from 'http';
import https from 'https';

// //////////////// //
// INTERNAL MODULES //
// //////////////// //

import path from 'path';
import fs from 'fs';

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

import appModule from './modules/app';
import configModule from './modules/config';
import loggerModule from './modules/logger';
import passportModule from './modules/passport';

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

const config = configModule({ dotenv });
const logger = loggerModule({ winston }, config);

// ////////////////////// //
// MONGOOSE CONFIGURATION //
// ////////////////////// //

mongoose.Promise = Promise;
mongoose.connect(config.database.mongo.uri, { useMongoClient: true });

// ///////////////// //
// MODULES INJECTION //
// ///////////////// //

const User = userModel({ mongoose, bcrypt });

// ///////////////////// //
// APPLICATION INJECTION //
// ///////////////////// //

const app = appModule({
  express,
  logger,
  helmet,
  morgan,
  expressValidator,
  passport,
  bodyParser,
}, {
  user: userController({ passport, logger, jwt }, { User }, config)(express.Router()),
}, config);

// ////////// //
// INITIALIZE //
// ////////// //

passportModule({
  passport,
  passportLocal,
  passportJwt,
}, {
  User,
}, config);

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

if (config.server.production) {
  const ssl = {
    key: fs.readFileSync(config.server.ssl.key),
    cert: fs.readFileSync(config.server.ssl.cert),
  };

  const instanse = http.createServer(app);
  const server = https.createServer(ssl, instanse);

  server.listen(config.server.port, onStartEvent);
  server.on('err', onErrorEvent);
  server.on('listening', onListenEvent(server));
} else {
  const server = http.createServer(app);

  server.listen(config.server.port, onStartEvent);
  server.on('err', onErrorEvent);
  server.on('listening', onListenEvent(server));
}

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
