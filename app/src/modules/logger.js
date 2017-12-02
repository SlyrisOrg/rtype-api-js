export default ({
  fs,
  path,
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

  const logFilePath = path.resolve(process.cwd(), "var"," log", "combined.log");

  if (!fs.existsSync(logFilePath)) {
    fs.mkdirSync(logFilePath);
  }

  const fileLogger = new winston.transports.File({
    filename: logFilePath,
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
