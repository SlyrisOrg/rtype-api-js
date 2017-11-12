export default ({
  configs,
}) => (
  async (experience) => {
    if (!experience) {
      throw configs.response.emptyExperience;
    }

    if (typeof experience !== 'number') {
      throw configs.response.badFormatExperience;
    }

    return experience;
  }
);
