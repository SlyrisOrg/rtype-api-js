export default ({
  validator,
  configs,
}) => (
  async (password) => {
    if (!password || validator.isEmpty(password)) {
      throw configs.response.emptyPassword;
    }

    if (!validator.isLength(password, { min: 3, max: 20 })) {
      throw configs.response.badFormatPassword;
    }

    return password;
  }
);
