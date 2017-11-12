export default ({
  validator,
  configs,
}) => (
  async (icon) => {
    if (!icon) {
      throw configs.response.emptyIcon;
    }

    if (typeof icon !== 'number') {
      throw configs.response.badFormatIcon;
    }

    return icon;
  }
);
