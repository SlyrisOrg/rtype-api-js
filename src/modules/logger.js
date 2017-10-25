export default ({
  winston,
  configs,
}) => {
  winston.cli();

  const consoleLogger = new winston.transports.Console({
    timestamp: true,
    level: configs.server.production ? "error" : "debug",
    handleExceptions: true,
    prettyPrint: true,
    silent: false,
    json: false,
    humanReadableUnhandledException: true,
    colorize: !configs.server.production,
  });

  return new winston.Logger({
    transports: [consoleLogger],
    exitOnError: false,
  });
};
