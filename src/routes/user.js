import * as userController from "../controllers/user";
import * as userSigninController from "../controllers/user/signin";
import * as userSignupController from "../controllers/user/signup";

/**
 * Token checker middleware
 *
 * @param {Object} deps
 * @param {Object} configs
 *
 * @return {Function}
 */
const verifyTokenMiddleware = (deps, configs) => async (req, res, next) => {
  try {
    const token = req.get("Authorization").substring(4);
    const data = await deps.jwt.verify(token, configs.server.secret);

    if (!data || !data._id) {
      res.json({
        "success": false,
        "payload": configs.payload.system.unvalidToken,
        "content": {}
      });
      return;
    }

    req.user = deps.mongo.ObjectId(data._id);
    next();
  } catch (err) {
    deps.logger.error(`Token verify error: ${err}`);
    res.json({
      "success": false,
      "payload": configs.payload.system.unvalidToken,
      "content": {}
    });
  }
};

export default (deps, configs) => (router) => {
  router.get(
    "/",
    verifyTokenMiddleware(deps, configs),
    userController.get(deps, configs)
  );

  router.put(
    "/",
    verifyTokenMiddleware(deps, configs),
    userController.put(deps, configs)
  );

  router.post(
    "/",
    verifyTokenMiddleware(deps, configs),
    userController.postcheckerMiddleware(deps),
    userController.post(deps, configs)
  );

  router.post(
    "/signin",
    userSigninController.postCheckerMiddleware(deps),
    userSigninController.post(deps, configs)
  );

  router.post(
    "/signup",
    userSignupController.postCheckerMiddleware(deps),
    userSignupController.post(deps, configs)
  );

  return router;
};
