const s4 = () => (
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1)
);

const guid = () => (
  `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`
);

export default ({
  configs,
}) => (
  async (filePath, options, callback) => {
    try {
      const file = await import(filePath);

      const id = guid();

      const populated = file.default(id, configs.response, options);
      const rendered = JSON.stringify(populated);
      return callback(null, rendered);
    } catch (err) {
      callback(err, null);
    }
  }
);
