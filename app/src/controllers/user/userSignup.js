export default ({
  verifier,
  database,
  logger,
}) => (
  async (req, res) => {
    try {
      const body = await verifier.user({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
      });

      await database.signupUser(body);

      res.render("success");
    } catch (err) {
      logger.error("Signup controller:", err, err.stack);
      res.render("error", err);
    }
  }
);
