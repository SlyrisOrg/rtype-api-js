import userSigninController from "./signin";
import userSignupController from "./signup";

export const userFetchController = ({ database, logger }, configs) =>
  async (req, res) => {
    try {
      const data = await database.getUserData(req.user);

      res.success({
        content: data,
      });
    } catch (err) {
      switch (err) {
        case configs.payload.getUserData: {
          res.error({
            payload: err,
            message: configs.message.getUserData,
          });
          break;
        }
        default: {
          logger.error("Fetch user data error:", err);
          res.error();
          break;
        }
      }
    }
  };

export const userUpdateController = ({ database, logger, verifier }, configs) =>
  async (req, res) => {
    const errors = verifier(req.body);

    if (errors.length) {
      res.error({
        payload: errors[0],
        message: configs.message.input(errors.length),
      });
      return;
    }

    try {
      await database.updateUserData(req.user, req.body);

      res.success();
    } catch (err) {
      switch (err) {
        case configs.payload.putUserData: {
          res.error({
            payload: err,
            message: configs.message.putUserData,
          });
          break;
        }
        default: {
          logger.error("Update user data error:", err);
          res.error();
          break;
        }
      }
    }
  };

export const userCreateController = ({ verifier, database, logger }, configs) =>
  async (req, res) => {
    const errors = verifier(req.body);

    if (errors.length) {
      res.error({
        payload: errors[0],
        message: configs.message.input(errors.length),
      });
      return;
    }

    try {
      await database.createUserData(req.user, req.body);

      res.success();
    } catch (err) {
      switch (err) {
        case configs.payload.alreadyTakenPseudo: {
          res.error({
            payload: err,
            message: configs.message.alreadyTakenPseudo,
          });
          break;
        }
        case configs.payload.postUserData: {
          res.error({
            payload: err,
            message: configs.message.postUserData,
          });
          break;
        }
        default: {
          logger.error("Create user data error:", err);
          res.error();
          break;
        }
      }
    }
  };

const verifyTokenMiddleware = ({ jwt }, configs) =>
  async (req, res, next) => {
    try {
      const token = req.get("Authorization").substring(4);
      const data = await jwt.verify(token, configs.server.secret);

      if (!data || !data._id) {
        res.json({
          success: false,
          payload: configs.payload.unvalidToken,
          content: {},
        });
        return;
      }

      req.user = data._id;
      next();
    } catch (err) {
      res.error({
        payload: configs.payload.unvalidToken,
        message: configs.message.unvalidToken,
      });
    }
  };

export default (deps, configs) =>
  (router) => {
    router.get(
      "/",
      verifyTokenMiddleware(deps, configs),
      userFetchController(deps, configs),
    );

    router.put(
      "/",
      verifyTokenMiddleware(deps, configs),
      userUpdateController(deps, configs),
    );

    router.post(
      "/",
      verifyTokenMiddleware(deps, configs),
      userCreateController(deps, configs),
    );

    router.post(
      "/signin",
      userSigninController(deps, configs),
    );

    router.post(
      "/signup",
      userSignupController(deps, configs),
    );

    return router;
  };
