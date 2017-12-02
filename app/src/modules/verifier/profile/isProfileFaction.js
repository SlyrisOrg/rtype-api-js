export default ({
  configs,
}) => (
  async (faction) => {
    if (typeof faction !== "number") {
      throw configs.response.badFormatFaction;
    }

    return faction;
  }
);
