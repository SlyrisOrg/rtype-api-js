export default ({
  configs,
}) => (
  async (moveSpeed) => {
    if (!moveSpeed) {
      throw configs.response.emptyMoveSpeed;
    }

    if (typeof moveSpeed !== 'number') {
      throw configs.response.badFormatMoveSpeed;
    }

    if (moveSpeed > 1000) {
      throw configs.response.badFormatMoveSpeed;
    }

    return moveSpeed;
  }
);
