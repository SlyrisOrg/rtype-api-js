// //////////////// //
// INTERNAL MODULES //
// //////////////// //

import crypto from 'crypto';
import path from 'path';
import http from 'http';
import https from 'https';
import fs from 'fs';
import util from 'util';

// //////////////// //
// EXTERNAL MODULES //
// //////////////// //

import bodyParser from 'body-parser';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import winston from 'winston';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import passport from 'passport';
import dotenv from 'dotenv';

// ///////////// //
// TIERS MODULES //
// ///////////// //

import configModule from './modules/config';
import mongoModule from './modules/mongo';
import loggerModule from './modules/logger';

// /////////// //
// CONTROLLERS //
// /////////// //

import userController from './controllers/user';

// ////// //
// MODELS //
// ////// //

import userModel from './models/user';

// ///////////////////////////// //
// APPLICATION MODULES INJECTION //
// ///////////////////////////// //

const config = configModule({ dotenv, fs });

const logger = loggerModule({ winston }, config);
const mongo = mongoModule({ mongoose }, config);

const User = userModel({ util, mongoose, bcrypt }, config);

// //////////////////// //
// APPLICATION INSTANCE //
// //////////////////// //

const app = express();

// /////////////// //
// SECURITY LAYERS //
// /////////////// //

app.use(helmet());
app.use(morgan('combined', { stream: { write: message => logger.info(message) } }));

// ///////////// //
// PARSER LAYERS //
// ///////////// //

app.use(bodyParser.json({
  type: '*/*',
  verify: (req, res, buf) => {
    const signature = req.headers['x-hub-signature'];

    if (!signature) {
      if (config.server.production) {
        throw new Error("Couldn't find the signature");
      } else {
        logger.warn("Couldn't find the signature");
      }
    } else {
      const elements = signature.split('=');
      const signatureHash = elements[1];
      const expectedHash = crypto
        .createHmac('sha1', config.server.secret)
        .update(buf)
        .digest('hex');

      if (signatureHash !== expectedHash) {
        throw new Error("Couldn't validate the request signature");
      }
    }
  },
}));
app.use(bodyParser.urlencoded({ extended: true, defer: true }));

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

// /////////////// //
// STATIC ENDPOINT //
// /////////////// //

app.use(express.static(path.resolve(process.cwd(), '/public')));

// /////////////////// //
// CONTROLLER ENDPOINT //
// /////////////////// //

app.use('/api/user', userController({ util, passport }, { logger }, { User })(express.Router()));

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
