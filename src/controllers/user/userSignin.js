export default ({
  verifier,
  database,
  logger,
  configs,
}) => (
  async (req, res) => {
    try {
      const pre = Object
        .keys({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        })
        .filter(key => !!req.body[key])
        .reduce((object, key) => ({
          ...object,
          [key]: req.body[key],
        }), {});

      if (!pre.name && !pre.email) {
        throw configs.response.emptyCredential;
      }

      const body = await verifier.user(pre);
      const token = await database.signinUser(body);

      res.render("success", {
        content: {
          token,
        },
      });
    } catch (err) {
      logger.error("Signup controller", err);
      res.render("error", err);
    }
  }
);