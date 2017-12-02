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

  const fileLogger = new winston.transports.File({
    filename: 'combined.log',
    level: "error",
  });

  return new winston.Logger({
    transports: [
      consoleLogger,
      fileLogger
    ],
    exitOnError: false,
  });
};
