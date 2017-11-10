export default () => (
  async (req, res, next) => {
    res.set("Content-Type", "application/json");
    next();
  }
);
