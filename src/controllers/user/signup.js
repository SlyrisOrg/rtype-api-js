export default ({ verifier, database, logger }, configs) =>
  async (req, res) => {
    try {
      const body = await verifier({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
      });

      await database.signupUser(body);

      res.success();
    } catch (err) {
      switch (err) {
        case configs.payload.alreadyTakenName: {
          res.error({
            payload: err,
            message: configs.message.alreadyTakenName,
          });
          break;
        }
        case configs.payload.alreadyTakenEmail: {
          res.error({
            payload: err,
            message: configs.message.alreadyTakenEmail,
          });
          break;
        }
        case configs.payload.signupUser: {
          res.error({
            payload: err,
            message: configs.message.signupUser,
          });
          break;
        }
        default: {
          logger.error("Signup user route error:", err);
          res.error();
          break;
        }
      }
    }
  };
