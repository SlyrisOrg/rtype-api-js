export default ({ verifier, database, logger }, configs) =>
  async (req, res) => {
    try {
      if (!req.body.name && !req.body.email) {
        throw configs.payload.emptyCredential;
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
      switch (err) {
        case configs.payload.emptyCredential: {
          res.error({
            payload: err,
            message: configs.message.emptyCredential,
          });
          break;
        }
        case configs.payload.emptyName: {
          res.error({
            payload: err,
            message: configs.message.emptyName,
          });
          break;
        }
        case configs.payload.emptyEmail: {
          res.error({
            payload: err,
            message: configs.message.emptyEmail,
          });
          break;
        }
        case configs.payload.emptyPassword: {
          res.error({
            payload: err,
            message: configs.message.emptyPassword,
          });
          break;
        }
        case configs.payload.signinUser: {
          res.error({
            payload: err,
            message: configs.message.signinUser,
          });
          break;
        }
        default: {
          logger.error("Signin user route error:", err);
          res.error();
          break;
        }
      }
    }
  };
