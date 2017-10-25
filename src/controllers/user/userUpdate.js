export default ({
  database,
  verifier,
}) => (
  async (req, res) => {
    try {
      await verifier.all(req.body);
      await database.updateUserData(req.user, req.body);
      res.render("success");
    } catch (err) {
      res.render("error", err);
    }
  }
);