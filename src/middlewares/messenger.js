export default ({ guid }, configs) => (
  async (filePath, message, callback) => {
    try {
      console.log(filePath)
      const file = await import(filePath);

      const id = guid();

      const populated = file.default(id, configs.payload, configs.message, message);
      const rendered = JSON.stringify(populated);
      return callback(null, rendered);
    } catch (err) {
      callback(err, null);
    }
  }
);
