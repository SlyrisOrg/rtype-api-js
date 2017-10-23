export default (deps, configs) => async () =>
  deps.mongo.MongoClient.connect(configs.database.mongo.uri);
