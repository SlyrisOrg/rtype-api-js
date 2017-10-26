import apiHeaderMiddleware from "./apiHeader";
import debugLoggerMiddleware from "./debugLogger";
import signatureMiddleware from "./signature";
import parserErrorCatcherMiddlware from "./parserErrorCatcher";

export default ({
  configs,
  logger,
  bcrypt,
  helmet,
  bodyParser,
  morgan,
  path,
  express,
}, router) => {
  // /////////////// //
  // SECURITY LAYERS //
  // /////////////// //

  router.use(helmet());
  router.use(helmet.hpkp({
    maxAge: 7776000,
    sha256s: ["AbCdEf123=", "ZyXwVu456="],
  }));
  router.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'"],
    },
  }));
  router.use(helmet.noCache());
  router.use(signatureMiddleware({
    bcrypt,
    configs,
  }));

  // ///////////// //
  // PARSER LAYERS //
  // ///////////// //

  router.use(apiHeaderMiddleware());
  router.use(bodyParser.urlencoded({ extended: true, defer: true }));
  router.use(bodyParser.json({ type: "*/*" }));
  router.use(parserErrorCatcherMiddlware({
    configs,
  }));

  // ///////////// //
  // HELPER LAYERS //
  // ///////////// //

  router.use(morgan("combined", {
    stream: {
      write: message => logger.info(message),
    },
  }));
  router.use(debugLoggerMiddleware({
    logger,
  }));

  router.use("/", express.static(path.resolve(process.cwd(), "public")));

  return router;
};
