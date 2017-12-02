export default ({
  configs,
}) => (
  async (support) => {
    if (!support) {
      throw configs.response.emptysupport;
    }

    if (typeof support !== 'number') {
      throw configs.response.badFormatsupport;
    }

    if (support > 1000) {
      throw configs.response.badFormatsupport;
    }

    return support;
  }
);
