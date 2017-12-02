export default ({
  verifier,
  database,
  logger,
  configs,
}) => (
  async (req, res) => {
    try {
      const identifier = Object
        .entries({
          name: req.body.name,
          email: req.body.email,
        })
        .reduce((obj, [key, value]) => {
          if (!value) {
            return obj;
          }
          return {
            ...obj,
            [key]: value,
          }
        }, {});

      if (!identifier.name && !identifier.email) {
        throw configs.response.emptyCredential;
      }

      const pre = {
        ...identifier,
        password: req.body.password,
      }

      const body = await verifier.user(pre);
      const user = await database.signinUser(body);

      res.render("success", {
        content: user,
      });
    } catch (err) {
      logger.error("Signin controller:", err);
      res.render("error", err);
    }
  }
);
