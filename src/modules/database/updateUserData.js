export default ({
  configs,
  mongo,
}, client) => (
  async (id, data) => {
    const db = await client;
    const col = await db.collection(configs.database.mongo.collections.users);
    const user = await col.findOne({
      _id: mongo.ObjectId(id),
    }, {
      password: false,
    });

    // Check if available data

    const availableData = await col.findOne({
      $or: [
        { nickname: data.nickname },
        { name: data.name },
        { email: data.email },
      ],
    }, {
      nickname: true,
      name: true,
      email: true,
    });

    if (availableData) {
      if (availableData.nickname === data.nickname) {
        throw configs.response.alreadyTakenNickname;
      }

      if (availableData.name === data.name) {
        throw configs.response.alreadyTakenName;
      }

      if (availableData.email === data.email) {
        throw configs.response.alreadyTakenEmail;
      }
    }

    // Send current user data to database

    const newUserData = {
      ...user,
      ...data,
    };

    await col.findOneAndUpdate({
      _id: mongo.ObjectId(id),
    }, newUserData);

    return true;
  }
);
