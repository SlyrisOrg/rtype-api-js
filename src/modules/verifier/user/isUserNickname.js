export default ({
  validator,
  configs,
}) => (
  async (nickname) => {
    if (!nickname || validator.isEmpty(nickname)) {
      throw configs.response.emptyNickname;
    }

    if (!validator.isLength(nickname, { min: 1, max: 25 })) {
      throw configs.response.badFormatNickname;
    }

    if (!validator.isAlphanumeric(nickname)) {
      throw configs.response.badFormatNickname;
    }

    return nickname;
  }
);
