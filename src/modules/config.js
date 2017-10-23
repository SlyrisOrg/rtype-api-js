export default (deps, configs) => {
  // ////// //
  // DOTENV //
  // ////// //

  deps.dotenv.config();

  return {
    "server": deps.helper.verifyObject({
      "env": process.env.NODE_ENV,
      "production": process.env.NODE_ENV === "production",
      "port": process.env.PORT,
      "locale": configs.general.locale,
      "secret": process.env.SECRET,
      "signature": process.env.SIGNATURE,
      "ssl": {
        "key": process.env.SSL_KEY,
        "cert": process.env.SSL_CERTIFICAT
      }
    }),
    "database": deps.helper.verifyObject({
      "mongo": {
        "uri": process.env.MONGO_URI,
        "collection": {
          "user": process.env.MONGO_USERS_COLLECTION
        }
      }
    }),
    "payload": deps.helper.verifyObject(configs.payload),
    "model": deps.helper.verifyObject(configs.model)
  };
};
