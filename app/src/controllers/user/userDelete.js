export default ({
  database,
  logger,
}) => (
  async (req, res) => {
    try {
      const data = await database.deleteUserData(req.user);

      res.render("success", {
        content: data,
      });
    } catch (err) {
      logger.error("User read controller:", err, err.stack);
      res.render("error", err);
    }
  }
);
