export default ({
  configs,
}) => (
  async (level) => {
    if (!level) {
      throw configs.response.emptyLevel;
    }

    if (typeof level !== 'number') {
      throw configs.response.badFormatLevel;
    }

    return level;
  }
);
