export default ({
  verifier,
  database,
  logger,
}) => (
  async (req, res) => {
    try {
      const user = await verifier.user({
        nickname: req.body.nickname,
        icon: req.body.icon,
      });

      const profile = await verifier.profile({
        faction: req.body.profile && req.body.profile.faction,
        ship: req.body.profile && req.body.profile.faction,
      });

      const body = {
        ...user,
        profile,
      };

      await database.createUserData(req.user, body);
      res.render("success");
    } catch (err) {
      logger.error("User create controller:", err, err.stack);
      res.render("error", err);
    }
  }
);
