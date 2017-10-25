import userSigninController from "./signin";
import userSignupController from "./signup";

export const userFetchController = ({ database }) => (
  async (req, res, next) => {
    try {
      const data = await database.getUserData(req.user);

      res.success({
        content: data,
      });
    } catch (err) {
      res.render("error", err);
    }
  }
);

export const userUpdateController = ({ database, verifier }) => (
  async (req, res, next) => {
    const errors = verifier(req.body);

    if (errors.length) {
      throw errors[0];
    }

    try {
      await database.updateUserData(req.user, req.body);

      res.success();
    } catch (err) {
      res.render("error", err);
    }
  }
);

export const userCreateController = ({ verifier, database }) => (
  async (req, res, next) => {
    const errors = verifier(req.body);

    if (errors.length) {
      throw errors[0];
    }

    try {
      await database.createUserData(req.user, req.body);

      res.success();
    } catch (err) {
      res.render("error", err);
    }
  }
);

const verifyTokenMiddleware = ({ jwt }, configs) => (
  async (req, res, next) => {
    try {
      const token = req.get("Authorization").substring(4);
      const data = await jwt.verify(token, configs.server.secret);

      if (!data || !data._id) {
        throw configs.message.unvalidToken.payload;
      }

      req.user = data._id;
      next();
    } catch (err) {
      res.render("error", err);
    }
  }
);

export default (deps, configs) => (
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
  }
);
