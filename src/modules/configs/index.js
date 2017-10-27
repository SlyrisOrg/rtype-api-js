import databaseConfigs from "./database";
import mailerConfigs from "./mailer";
import responseConfigs from "./response";
import serverConfigs from "./server";

export default () => ({
  server: serverConfigs(),
  database: databaseConfigs(),
  response: responseConfigs(),
  mailer: mailerConfigs(),
});
