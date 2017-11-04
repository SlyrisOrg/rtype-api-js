export default ({
  mongo,
  configs,
}, client) => (
  async (id) => {
    const db = await client;
    const col = await db.collection(configs.database.mongo.collections.users);
    await col.remove({
      _id: mongo.ObjectId(id),
    });

    return true;
  }
);
