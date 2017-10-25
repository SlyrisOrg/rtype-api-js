export default ({
  configs,
}) => (
  (error, req, res, next) => {
    if (error instanceof SyntaxError) {
      res.render("error", configs.response.badRequest.payload);
      return;
    }
    next();
  }
);