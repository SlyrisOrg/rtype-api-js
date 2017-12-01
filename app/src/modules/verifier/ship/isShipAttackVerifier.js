export default ({
  configs,
}) => (
  async (attack) => {
    if (!attack) {
      throw configs.response.emptyLevel;
    }

    if (typeof attack !== 'number') {
      throw configs.response.badFormatLevel;
    }

    if (attack > 1000) {
      throw configs.response.badFormatAttack;
    }

    return attack;
  }
);
