export default (deps, configs) =>
  deps.mongoose.createConnection(configs.database.mongo.uri);
