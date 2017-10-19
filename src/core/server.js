export default (deps, configs) => {
  // ////////////////////// //
  // SERVER EVENTS LISTENER //
  // ////////////////////// //

  const onStartEvent = () =>
    deps.logger.info(`Application launched on ${configs.server.env}`);

  const onErrorEvent = (err) => {
    if (err.syscall !== 'listen') {
      throw new Error(err);
    }

    const bind = typeof configs.server.port === 'string'
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

  const onListenEvent = server => () => {
    const addr = server.address();
    const bind = typeof addr === 'string'
      ? `pipe ${addr}`
      : `port ${addr.port}`;
    deps.logger.info(`Application listening on ${bind}`);
  };

  // /////////////// //
  // SERVER INSTANCE //
  // /////////////// //

  if (configs.server.production) {
    const ssl = {
      key: deps.fs.readFileSync(configs.server.ssl.key),
      cert: deps.fs.readFileSync(configs.server.ssl.cert),
    };
    const instanse = deps.http.createServer(deps.app);
    const server = deps.https.createServer(ssl, instanse);

    server.listen(configs.server.port, onStartEvent);
    server.on('err', onErrorEvent);
    server.on('listening', onListenEvent(server));
  } else {
    const server = deps.http.createServer(deps.app);

    server.listen(configs.server.port, onStartEvent);
    server.on('err', onErrorEvent);
    server.on('listening', onListenEvent(server));
  }
};
