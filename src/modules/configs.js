const verifyConfigs = (configs) => {
  const errors = Object.keys(configs)
    .map((index) => {
      if (configs[index]) {
        if (typeof configs[index] === "object") {
          return verifyConfigs(configs[index]);
        } else if (typeof configs[index] === "undefined") {
          return index;
        }
      }
      return null;
    })
    .filter(index => !!configs[index]);

  if (errors.lenght) {
    throw new Error(`Error in configurations: ${errors}`);
  }

  return configs;
};

const verifyAll = configsList =>
  Object.keys(configsList)
    .reduce((configs, index) => {
      const unpackedConfigs = configsList[index]();
      const validedConfigs = verifyConfigs(unpackedConfigs);
      return {
        ...configs,
        [index]: validedConfigs,
      };
    }, {});

export default (deps, configs) => {
  deps.dotenv.config();

  return verifyAll(configs);
};
