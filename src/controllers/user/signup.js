export default ({ verifier, database }) => (
  async (req, res, next) => {
    try {
      const body = await verifier({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
      });

      await database.signupUser(body);

      res.success();
    } catch (err) {
      res.render("error", err);
    }
  }
);
