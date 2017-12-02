export default ({
  verifier,
  database,
  logger,
}) => (
  async (req, res) => {
    try {
      const user = await verifier.user({
        nickname: req.body.nickname,
        icon: req.body.faction,
      });

      const profile = await verifier.profile({
        faction: req.body.faction,
        ship: req.body.faction,
      });

      const body = {
        ...user,
        profile,
      };

      await database.createUserData(req.user, body);
      res.render("success");
    } catch (err) {
      logger.error("User create controller:", err);
      res.render("error", err);
    }
  }
);
