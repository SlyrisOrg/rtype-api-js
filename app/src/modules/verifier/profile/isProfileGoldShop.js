export default ({
  configs,
}) => (
  async (goldShop) => {
    if (typeof goldShop !== 'number') {
      throw configs.response.badFormatGoldshop;
    }

    return goldShop;
  }
);
