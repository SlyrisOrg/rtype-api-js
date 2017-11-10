import userSigninController from "./userSignin";
import userSignupController from "./userSignup";
import userReadController from "./userRead";
import userDeleteController from "./userDelete";
import userUpdateController from "./userUpdate";
import userCreateController from "./userCreate";

const verifyTokenMiddleware = ({
  jwt,
  configs,
}) => (
  async (req, res, next) => {
    try {
      const token = req.get("Authorization").substring(4);
      const data = await jwt.verify(token, configs.server.secret);

      if (!data || !data._id) {
        throw configs.response.unvalidToken.payload;
      }

      req.user = data._id;
      next();
    } catch (err) {
      res.render("error", err);
    }
  }
);

export default deps => (
  (router) => {
    router.get(
      "/",
      verifyTokenMiddleware(deps),
      userReadController(deps),
    );

    router.put(
      "/",
      verifyTokenMiddleware(deps),
      userUpdateController(deps),
    );

    router.post(
      "/",
      verifyTokenMiddleware(deps),
      userCreateController(deps),
    );

    router.post(
      "/",
      verifyTokenMiddleware(deps),
      userDeleteController(deps),
    );

    router.post(
      "/signin",
      userSigninController(deps),
    );

    router.post(
      "/signup",
      userSignupController(deps),
    );

    return router;
  }
);
