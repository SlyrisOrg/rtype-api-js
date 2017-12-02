// //////////// //
// NODE MODULES //
// //////////// //

import fs from "fs";
import path from "path";
import http from "http";

// //////////////// //
// EXTERNAL MODULES //
// //////////////// //

import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import mongo from "mongodb";
import winston from "winston";
import bcrypt from "bcrypt";
import validator from "validator";
import nodemailer from "nodemailer";

// //////////////// //
// INTERNAL MODULES //
// //////////////// //

import configsModule from "./modules/configs";
import loggerModule from "./modules/logger";
import databaseModule from "./modules/database";
import verifierModule from "./modules/verifier";
import mailerModule from "./modules/mailer";
import messengerEngine from "./modules/messenger";

// /////////// //
// APP MODULES //
// /////////// //

import middlewares from "./middlewares";
import controllers from "./controllers";

// //////////////// //
// INITIALE MODULES //
// //////////////// //

const varDirPath = path.join(process.cwd(), "var");

if (!fs.existsSync(varDirPath)) {
  fs.mkdirSync(varDirPath);
}

const configs = configsModule();

const logger = loggerModule({
  fs,
  path,
  winston,
  configs,
});

const mailer = mailerModule({
  nodemailer,
  configs,
});

// ///////////////////// //
// HANDLE PROCESS SIGNAL //
// ///////////////////// //

process.on("SIGINT", () => {
  logger.info("Application exit");
  process.exit(0);
});
process.on("SIGTERM", () => {
  logger.warn("Application interupted");
  process.exit(0);
});
process.on("uncaughtException", (err) => {
  logger.error("Caught exception:", err);
  process.exit(1);
});
process.on("unhandledRejection", (reason, p) => {
  logger.error("Unhandled Rejection at:", p, "and reason:", reason);
  process.exit(1);
});

// /////////// //
// APPLICATION //
// /////////// //

const app = express();

try {
  // /////// //
  // ENGINES //
  // /////// //

  app.engine("js", messengerEngine({
    configs,
  }));
  app.set("view engine", "js");
  app.set("views", path.resolve(__dirname, "views"));

  // ///////////////// //
  // SECONDARY MODULES //
  // ///////////////// //

  const database = databaseModule({
    mongo,
    bcrypt,
    jwt,
    configs,
  });

  const verifier = verifierModule({
    validator,
    configs,
  });

  // //////////////// //
  // APPLICATION CORE //
  // //////////////// //

  app.use(middlewares({
    configs,
    logger,
    bcrypt,
    helmet,
    bodyParser,
    morgan,
    path,
    express,
  }, express.Router()));

  app.use(controllers({
    logger,
    jwt,
    database,
    verifier,
    configs,
    express,
  }, express.Router()));

  // /////////////// //
  // SERVER INSTANCE //
  // /////////////// //

  const server = http.createServer(app);

  server.listen(configs.server.port, () =>
    logger.info("Application launched on", configs.server.env));
  server.on("err", (err) => {
    if (err.syscall !== "listen") {
      throw new Error(err);
    }

    const bind = configs.server.port instanceof String
      ? `Pipe ${configs.server.port}`
      : `Port ${configs.server.port}`;

    switch (err.code) {
      case "EACCES":
        throw new Error(`${bind} port requires elevated privileges`);
      case "EADDRINUSE":
        throw new Error(`${bind} port is already in use`);
      default:
        throw err;
    }
  });
  server.on("listening", () => {
    const addr = server.address();
    const bind = addr instanceof String
      ? `pipe ${addr}`
      : `port ${addr.port}`;
    logger.info("Application listening on", bind);
  });
} catch (err) {
  logger.error("Application failure:", err);
  mailer.alert(err);
}

export default app;
