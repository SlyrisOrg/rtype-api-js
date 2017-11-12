export default ({
  configs,
}) => (
  async (faction) => {
    if (!faction) {
      throw configs.response.emptyFaction;
    }

    if (typeof faction !== 'number') {
      throw configs.response.badFormatFaction;
    }

    return faction;
  }
);
