export default ({
  configs,
}) => (
  async (ship) => {
    if (!ship) {
      throw configs.response.emptyShip;
    }

    if (typeof ship !== 'number') {
      throw configs.response.badFormatShip;
    }

    return ship;
  }
);
