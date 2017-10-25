import databaseConfigs from "./database";
import mailerConfigs from "./mailer";
import responseConfigs from "./response";
import serverConfigs from "./server";

const verifyConfigs = (config) => {
  const errors = Object
    .keys(config)
    .filter((index) => {
      if (typeof config[index] === "object") {
        return verifyConfigs(config[index]);
      }

      return !config[index];
    });

  if (errors.lenght) {
    throw new Error(`Error in configurations: ${errors}`);
  }

  return config;
};

const verifyAllConfigs = configs => (
  Object
    .keys(configs)
    .reduce((config, index) => ({
      ...config,
      [index]: verifyConfigs(configs[index]),
    }), {})
);

export default ({
  dotenv,
}) => {
  dotenv.config();

  return verifyAllConfigs({
    server: serverConfigs(),
    database: databaseConfigs(),
    response: responseConfigs(),
    mailer: mailerConfigs(),
  });
};
