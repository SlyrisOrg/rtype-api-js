export default ({
  verifier,
  database,
}) => (
  async (req, res) => {
    try {
      await verifier.all(req.body);
      await database.createUserData(req.user, req.body);
      res.render("success");
    } catch (err) {
      res.render("error", err);
    }
  }
);
