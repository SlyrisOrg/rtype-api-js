import userController from "./user";

export default ({
  logger,
  jwt,
  database,
  verifier,
  configs,
  express,
}, router) => {
  router.use("/api/user", userController({
    logger,
    jwt,
    database,
    verifier,
    configs,
  })(express.Router()));

  router.use("*", (req, res) => {
    res.render("error", configs.response.notFound);
  });

  return router;
};
