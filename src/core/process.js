export default (deps) => {
  // /////////////////// //
  // HANDLE PROCESS EXIT //
  // /////////////////// //

  const cleanExit = () => {
    deps.logger.info('Application exit');
    process.exit(0);
  };

  process.on('SIGINT', cleanExit);
  process.on('SIGTERM', cleanExit);

  // ////////////////////// //
  // HANDLE PROCESS FAILURE //
  // ////////////////////// //

  process.on('uncaughtException', (err) => {
    deps.logger.error(`Caught exception: ${err}`);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, p) => {
    deps.logger.error(`Unhandled Rejection at: ${p} and reason: ${reason}`);
    process.exit(1);
  });
};
