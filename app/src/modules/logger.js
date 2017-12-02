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

  const logDirPath = path.join(process.cwd(), "var","log");
  const logFilePath = path.join(logDirPath, "combined.log");

  if (!fs.existsSync(logDirPath)) {
    fs.mkdirSync(logDirPath);
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
