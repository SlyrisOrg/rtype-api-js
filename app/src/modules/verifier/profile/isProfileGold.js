export default ({
  configs,
}) => (
  async (gold) => {
    if (typeof gold !== 'number') {
      throw configs.response.badFormatGold;
    }

    return gold;
  }
);
