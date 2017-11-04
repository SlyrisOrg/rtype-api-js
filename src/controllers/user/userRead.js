export default ({
  database,
}) => (
  async (req, res) => {
    try {
      const data = await database.readUserData(req.user);

      res.render("success", {
        content: data,
      });
    } catch (err) {
      logger.error("User read controller", err);
      res.render("error", err);
    }
  }
);
