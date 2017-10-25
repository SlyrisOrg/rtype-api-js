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
      res.render("error", err);
    }
  }
);
