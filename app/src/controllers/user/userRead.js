export default ({
  database,
  logger,
}) => (
  async (req, res) => {
    try {
      const data = await database.readUserData(req.user);

      res.render("success", {
        content: data,
      });
    } catch (err) {
      logger.error("User read controller:", err, err.stack);
      res.render("error", err);
    }
  }
);
