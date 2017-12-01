export default ({
  configs,
}) => (
  async (gold) => {
    if (!gold) {
      throw configs.response.emptyGold;
    }

    if (typeof gold !== 'number') {
      throw configs.response.badFormatGold;
    }

    return gold;
  }
);
