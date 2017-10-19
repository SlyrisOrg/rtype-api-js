import crypto from 'crypto';
import path from 'path';
import http from 'http';
import https from 'https';
import fs from 'fs';

import _ from 'lodash';
import bodyParser from 'body-parser';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import * as modules from './modules';
import * as controllers from './controllers';
import * as configs from './configs';

// //////////////////// //
// APPLICATION INSTANCE //
// //////////////////// //

const app = express();

// /////////////// //
// SECURITY LAYERS //
// /////////////// //

app.use(helmet());
app.use(morgan('combined', { stream: { write: message => modules.logger.info(message) } }));

// ///////////// //
// PARSER LAYERS //
// ///////////// //

app.use(bodyParser.json({
  type: '*/*',
  verify: (req, res, buf) => {
    const signature = req.headers['x-hub-signature'];

    if (!signature) {
      if (configs.server.production) {
        throw new Error("Couldn't find the signature");
      } else {
        modules.logger.warn("Couldn't find the signature");
      }
    } else {
      const elements = signature.split('=');
      const signatureHash = elements[1];
      const expectedHash = crypto
        .createHmac('sha1', configs.server.secret)
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
    modules.logger.error('Bad format request');
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

app.use('/api/user', controllers.user(express.Router()));

// ////////////////////// //
// SERVER EVENTS LISTENER //
// ////////////////////// //

const onStartEvent = () =>
  modules.logger.info(`Application launched on ${configs.server.env}`);

const onErrorEvent = (err) => {
  if (err.syscall !== 'listen') {
    throw new Error(err);
  }

  const bind = _.isString(configs.server.port)
    ? `Pipe ${configs.server.port}`
    : `Port ${configs.server.port}`;

  switch (err.code) {
    case 'EACCES':
      throw new Error(`${bind} port requires elevated privileges`);
    case 'EADDRINUSE':
      throw new Error(`${bind} port is already in use`);
    default:
      throw err;
  }
};

const onListenEvent = (server) => {
  const addr = server.address();
  const bind = _.isString(addr)
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  modules.logger.info(`Application listening on ${bind}`);
};

// /////////////// //
// SERVER INSTANCE //
// /////////////// //

if (configs.server.production) {
  const ssl = {
    key: fs.readFileSync(configs.server.ssl.key),
    cert: fs.readFileSync(configs.server.ssl.cert),
  };

  const instanse = http.createServer(app);
  const server = https.createServer(ssl, instanse);

  server.listen(configs.server.port, onStartEvent);
  server.on('err', onErrorEvent);
  server.on('listening', onListenEvent(server));
} else {
  const server = http.createServer(app);

  server.listen(configs.server.port, onStartEvent);
  server.on('err', onErrorEvent);
  server.on('listening', onListenEvent(server));
}
