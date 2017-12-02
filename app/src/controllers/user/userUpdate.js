export default ({
  database,
  verifier,
  logger,
}) => (
  async (req, res) => {
    try {
      await verifier.all(req.body);
      await database.updateUserData(req.user, req.body);
      res.render("success");
    } catch (err) {
      logger.error("User update controller:", err, err.stack);
      res.render("error", err);
    }
  }
);
