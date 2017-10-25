export default ({ verifier, database }, configs) => (
  async (req, res, next) => {
    try {
      if (!req.body.name && !req.body.email) {
        throw configs.message.emptyCredential;
      }

      const credentials = (req.body.name && { name: req.body.name })
        || (req.body.email && { email: req.body.email });

      const body = await verifier({
        ...credentials,
        password: req.body.password,
      });

      const token = await database.signinUser(body);

      res.success({
        content: {
          token,
        },
      });
    } catch (err) {
      res.render("error", err);
    }
  }
);
