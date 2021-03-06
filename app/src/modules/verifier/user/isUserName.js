export default ({
  validator,
  configs,
}) => (
  async (name) => {
    if (!name || validator.isEmpty(name)) {
      throw configs.response.emptyName;
    }

    if (!validator.isLength(name, { min: 1, max: 25 })) {
      throw configs.response.badFormatName;
    }

    if (!validator.isAlphanumeric(name)) {
      throw configs.response.badFormatName;
    }

    return name;
  }
);
