export default ({
  configs,
}) => (
  async (health) => {
    if (!health) {
      throw configs.response.emptyHealth;
    }

    if (typeof health !== 'number') {
      throw configs.response.badFormatHealth;
    }

    if (support > 10000) {
      throw configs.response.badFormatHealth;
    }

    return health;
  }
);
