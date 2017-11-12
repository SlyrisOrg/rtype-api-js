export default ({
  mongo,
  configs,
}, client) => (
  async (id) => {
    const db = await client;
    const col = await db.collection(configs.database.mongo.collections.users);
    const user = await col.findOne({
      _id: mongo.ObjectId(id),
    }, {
      password: false,
    });

    if (!user) {
      throw configs.response.readUserData;
    }

    return user;
  }
);