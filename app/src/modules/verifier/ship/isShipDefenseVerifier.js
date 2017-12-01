export default ({
  configs,
}) => (
  async (defence) => {
    if (!defence) {
      throw configs.response.emptyDefence;
    }

    if (typeof defence !== "number") {
      throw configs.response.badFormatDefence;
    }

    if (defence > 1000) {
      throw configs.response.badFormatDefence;
    }

    return defence;
  }
);
