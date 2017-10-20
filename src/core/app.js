export default (deps, routes, configs) => {
  const app = deps.express();

  // /////////////// //
  // SECURITY LAYERS //
  // /////////////// //

  app.use(deps.helmet());
  app.use(deps.morgan('combined', { stream: { write: message => deps.logger.info(message) } }));
  app.use(deps.passport.initialize());

  // ///////////// //
  // HELPER LAYERS //
  // ///////////// //

  app.use(deps.expressValidator());

  // ///////////// //
  // PARSER LAYERS //
  // ///////////// //

  app.use(deps.bodyParser.json({
    type: '*/*',
    verify: async (req) => {
      const signature = req.headers['x-hub-signature'];

      if (!signature) {
        if (configs.server.production) {
          throw new Error("Couldn't find the signature");
        } else {
          deps.logger.warn("Couldn't find the signature");
        }
      } else {
        const elements = signature.split('=');
        const password = elements[1];
        const isMatch = await deps.bcrypt.compare(password, configs.server.auth);

        if (!isMatch) {
          throw new Error("Couldn't validate the request signature");
        }
      }
    },
  }));
  app.use(deps.bodyParser.urlencoded({ extended: true, defer: true }));

  // ///////////// //
  // ERROR CATCHER //
  // ///////////// //

  app.use((error, req, res, next) => {
    if (error instanceof SyntaxError) {
      deps.logger.error('Bad format request');
    } else {
      next();
    }
  });

  // /////////////// //
  // STATIC ENDPOINT //
  // /////////////// //

  app.use('/', deps.express.static(deps.path.resolve(process.cwd(), 'public')));

  // /////////////////// //
  // CONTROLLER ENDPOINT //
  // /////////////////// //

  Object.keys(routes).forEach((url) => {
    app.use(url, routes[url]);
  });

  // //////////////// //
  // DEFAULT ENDPOINT //
  // //////////////// //

  app.use('*', (req, res) => {
    res.json({
      success: false,
      payload: configs.payload.system.notFound,
    });
  });

  return app;
};
