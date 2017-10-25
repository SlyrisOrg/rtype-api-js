// //////////// //
// NODE MODULES //
// //////////// //

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
import dotenv from "dotenv";
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
import guidModule from "./modules/guid";

// /////////// //
// MIDDLEWARES //
// /////////// //

import signatureMiddleware from "./middlewares/signature";
import messengerMiddlware from "./middlewares/messenger";

// /////////// //
// CONTROLLERS //
// /////////// //

import userController from "./controllers/user";

// /////// //
// CONFIGS //
// /////// //

import serverConfig from "./configs/server";
import databaseConfig from "./configs/database";
import messageConfig from "./configs/message";

// ////////////////// //
// INITIALIZE MODULES //
// ////////////////// //

const guid = guidModule();

const configs = configsModule({
  dotenv,
}, {
  server: serverConfig,
  database: databaseConfig,
  message: messageConfig,
});

const logger = loggerModule({
  winston,
}, configs);

const database = databaseModule({
  mongo,
  bcrypt,
  jwt,
}, configs);

const verifier = verifierModule({
  validator,
}, configs);

const mailer = mailerModule({
  nodemailer,
}, configs);

const signature = signatureMiddleware({
  bcrypt,
}, configs);

const messenger = messengerMiddlware({
  guid,
}, configs);

// /////////// //
// APPLICATION //
// /////////// //

const app = express();

app.engine("js", messenger);

// /////////////////// //
// HANDLE PROCESS EXIT //
// /////////////////// //

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

try {
  app.set("views", path.resolve(process.cwd(), "src", "views"));

  app.use((req, res, next) => {
    res.set("Content-Type", "application/json");
    next();
  });

  // /////////////// //
  // SECURITY LAYERS //
  // /////////////// //

  app.use(helmet());
  app.use(helmet.hpkp({
    maxAge: 7776000,
    sha256s: ["AbCdEf123=", "ZyXwVu456="],
  }));
  app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'"],
    },
  }));
  app.use(helmet.noCache());
  app.use(signature);

  // ///////////// //
  // PARSER LAYERS //
  // ///////////// //

  app.use(bodyParser.urlencoded({ extended: true, defer: true }));
  app.use(bodyParser.json({ type: "*/*" }));
  app.use((error, req, res, next) => {
    if (error instanceof SyntaxError) {
      res.render("error", configs.message.badRequest.payload);
      return;
    }
    next();
  });

  // ///////////// //
  // HELPER LAYERS //
  // ///////////// //

  app.use(morgan("combined", {
    stream: {
      write: message => logger.info(message),
    },
  }));
  app.use((req, res, next) => {
    logger.debug(req.body);
    next();
  });

  // /////////////////// //
  // CONTROLLER ENDPOINT //
  // /////////////////// //

  app.use("/", express.static(path.resolve(process.cwd(), "public")));
  app.use("/api/user", userController({
    logger,
    jwt,
    database,
    verifier,
  }, configs)(express.Router()));
  app.use("*", (req, res) => {
    res.render("error", configs.message.notFound.payload);
  });

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

    const bind = typeof configs.server.port === "string"
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
    const bind = typeof addr === "string"
      ? `pipe ${addr}`
      : `port ${addr.port}`;
    logger.info("Application listening on", bind);
  });
} catch (err) {
  logger.error("Application failure:", err);
  mailer.alert(err);
}

export default app;
