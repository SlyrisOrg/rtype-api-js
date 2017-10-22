export default (deps, configs) => {
  deps.winston.cli();

  // /////////// //
  // BASE LOGGER //
  // /////////// //

  const consoleLogger = new deps.winston.transports.Console({
    timestamp: true,
    level: 'debug',
    handleExceptions: true,
    prettyPrint: true,
    silent: false,
    json: false,
    humanReadableUnhandledException: true,
    colorize: !configs.server.production,
  });

  consoleLogger.on('error', (err) => {
    throw new Error('Console error: ', err);
  });

  return new deps.winston.Logger({
    transports: [consoleLogger],
    exitOnError: false,
  });
};
