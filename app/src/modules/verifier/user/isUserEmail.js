export default ({
  validator,
  configs,
}) => (
  async (email) => {
    if (!email || validator.isEmpty(email)) {
      throw configs.response.emptyEmail;
    }

    if (!validator.isEmail(email)) {
      throw configs.response.badFormatEmail;
    }

    return email;
  }
);
