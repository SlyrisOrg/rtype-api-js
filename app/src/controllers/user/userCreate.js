export default ({
  verifier,
  database,
  logger,
}) => (
  async (req, res) => {
    try {
      await verifier.all(req.body);
      await database.createUserData(req.user, req.body);
      res.render("success");
    } catch (err) {
      logger.error("User create controller", err);
      res.render("error", err);
    }
  }
);
