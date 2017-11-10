export default ({
  logger,
}) => (
  async (req, res, next) => {
    logger.debug(req.body);
    next();
  }
);
