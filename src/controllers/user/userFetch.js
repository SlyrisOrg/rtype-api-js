export default ({
  database,
}) => (
  async (req, res) => {
    try {
      const data = await database.getUserData(req.user);

      res.render("success", {
        content: data,
      });
    } catch (err) {
      logger.error("User fetch controller", err);
      res.render("error", err);
    }
  }
);
