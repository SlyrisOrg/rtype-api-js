export default ({
  bcrypt,
  configs,
}) => (
  async (req, res, next) => {
    const signature = req.headers["x-hub-signature"];

    if (signature) {
      const elements = signature.split("=");
      const password = elements[1] || signature;
      const isMatch = await bcrypt.compare(password, configs.server.signature);

      if (isMatch) {
        next();
        return;
      }
    }

    res.render("error", configs.response.unvalidSignature.payload);
  }
);
