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
// CORE MODULES //
// ///////////// //

import appCore from './core/app';
import serverCore from './core/server';
import processCore from './core/process';
import configCore from './core/config';
import loggerCore from './core/logger';

// ///////////// //
// TIERS MODULES //
// ///////////// //

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

const config = configCore({
  dotenv,
}, {
  payload: {
    notFound: 'NOT_FOUND',
    internalError: 'INTERNAL_ERROR',
    badFormat: 'BAD_FORMAT',
    userSigninSuccess: 'USER_SUCCESS_SIGIN',
    userSigninFail: 'USER_FAIL_SIGIN',
    userSignupSuccess: 'USER_SUCCESS_SIGNUP',
    userSignupFail: 'USER_FAIL_SIGNUP',
  },
});

const logger = loggerCore({
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

const app = appCore({
  express,
  logger,
  helmet,
  morgan,
  expressValidator,
  passport,
  bodyParser,
  path,
}, {
  '/api/user': userController({
    passport,
    logger,
    jwt,
  }, {
    User,
  }, config)(express.Router()),
}, config);

// ////// //
// Server //
// ////// //

serverCore({
  fs,
  logger,
  http,
  https,
  app,
}, config);

// /////// //
// PROCESS //
// /////// //

processCore({
  logger,
});
