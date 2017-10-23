// ////////////// //
// SERVER MODULES //
// ////////////// //

import http from "http";

// //////////////// //
// INTERNAL MODULES //
// //////////////// //

import path from "path";

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

// ///////////// //
// TIERS MODULES //
// ///////////// //

import configModule from "./modules/config";
import loggerModule from "./modules/logger";
import databaseModule from "./modules/database";
import verifierModule from "./modules/verifier";

// /////////// //
// CONTROLLERS //
// /////////// //

import userRoute from "./routes/user";

// /////// //
// CONFIGS //
// /////// //

import generalConfig from "./configs/general.json";
import payloadConfig from "./configs/payload.json";

// ////////////////// //
// INITIALIZE MODULES //
// ////////////////// //

const config = configModule({
  dotenv
}, {
  "general": generalConfig,
  "payload": payloadConfig
});

const logger = loggerModule({
  winston
}, config);

const database = databaseModule({
  mongo
}, config);

const verifier = verifierModule({
  validator
}, config);

// /////////// //
// APPLICATION //
// /////////// //

const app = express();

// /////////////// //
// SECURITY LAYERS //
// /////////////// //

app.use(helmet());
app.use(helmet.hpkp({
  "maxAge": 7776000,
  "sha256s": ["AbCdEf123=", "ZyXwVu456="]
}));
app.use(helmet.contentSecurityPolicy({
  "directives": {
    "defaultSrc": ["'self'"],
    "styleSrc": ["'self'"]
  }
}));
app.use(helmet.noCache());
app.use(async (req, res, next) => {
  const signature = req.headers["x-hub-signature"];

  if (signature) {
    const elements = signature.split("=");
    const password = elements[1] || signature;
    const isMatch = await bcrypt.compare(password, config.server.signature);

    if (isMatch) {
      next();
      return;
    }
  }

  res.json({
    "success": false,
    "payload": config.payload.system.unvalidSignature
  });
});
// ///////////// //
// PARSER LAYERS //
// ///////////// //

app.use(bodyParser.urlencoded({ "extended": true, "defer": true }));
app.use(bodyParser.json({ "type": "*/*" }));

// ////////////////////////// //
// PARSER ERROR CATCHER LAYER //
// ////////////////////////// //

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError) {
    res.json({
      "success": false,
      "payload": config.payload.system.badRequest,
      "content": {}
    });
    return;
  }
  next();
});

// ///////////// //
// LOGGER LAYERS //
// ///////////// //

app.use(morgan("combined", { "stream": { "write": message => logger.info(message) } }));
app.use((req, res, next) => {
  logger.debug(req.body);
  next();
});

// /////////////// //
// STATIC ENDPOINT //
// /////////////// //

app.use("/", express.static(path.resolve(process.cwd(), "public")));

// /////////////////// //
// CONTROLLER ENDPOINT //
// /////////////////// //

app.use("/api/user", userRoute({
  logger,
  jwt,
  database,
  mongo,
  bcrypt,
  verifier
}, config)(express.Router()));

// //////////////// //
// DEFAULT ENDPOINT //
// //////////////// //

app.use("*", (req, res) => {
  res.json({
    "success": false,
    "payload": config.payload.system.notFound
  });
});

// ////////////////////// //
// SERVER EVENTS LISTENER //
// ////////////////////// //

const onStartEvent = () =>
  logger.info(`Application launched on ${config.server.env}`);

const onErrorEvent = (err) => {
  if (err.syscall !== "listen") {
    throw new Error(err);
  }

  const bind = typeof config.server.port === "string"
    ? `Pipe ${config.server.port}`
    : `Port ${config.server.port}`;

  switch (err.code) {
    case "EACCES":
      throw new Error(`${bind} port requires elevated privileges`);
    case "EADDRINUSE":
      throw new Error(`${bind} port is already in use`);
    default:
      throw err;
  }
};

const onListenEvent = server => () => {
  const addr = server.address();
  const bind = typeof addr === "string"
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  logger.info(`Application listening on ${bind}`);
};

// /////////////// //
// SERVER INSTANCE //
// /////////////// //

const server = http.createServer(app);

server.listen(config.server.port, onStartEvent);
server.on("err", onErrorEvent);
server.on("listening", onListenEvent(server));

// /////////////////// //
// HANDLE PROCESS EXIT //
// /////////////////// //

const cleanExit = () => {
  logger.info("Application exit");
  process.exit(0);
};

process.on("SIGINT", cleanExit);
process.on("SIGTERM", cleanExit);

// ////////////////////// //
// HANDLE PROCESS FAILURE //
// ////////////////////// //

process.on("uncaughtException", (err) => {
  logger.error(`Caught exception: ${err}`);
  process.exit(1);
});

process.on("unhandledRejection", (reason, p) => {
  logger.error(`Unhandled Rejection at: ${p} and reason: ${reason}`);
  process.exit(1);
});

export default app;
