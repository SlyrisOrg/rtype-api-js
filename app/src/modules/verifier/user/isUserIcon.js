export default ({
  validator,
  configs,
}) => (
  async (icon) => {
    if (typeof icon !== 'number') {
      throw configs.response.badFormatIcon;
    }

    return icon;
  }
);
