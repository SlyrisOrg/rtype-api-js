export default ({
  configs,
  mongo,
}, client) => (
  async (id, {
    nickname, icon, profile,
  }) => {
    const db = await client;
    const col = await db.collection(configs.database.mongo.collections.users);
    const databaseUser = await col.findOne({
      _id: mongo.ObjectId(id),
    });

    // Check if is new player

    if (!databaseUser.new) {
      throw configs.response.postData;
    }

    // Check if available data

    const notAvailableData = await col.findOne({
      $or: [
        { nickname },
      ],
    }, {
      nickname: true,
    });
console.log(nickname)
    if (notAvailableData) {
      if (notAvailableData.nickname === nickname) {
        throw configs.response.alreadyTakenNickname;
      }
    }

    // Create data

    const newUserData = {
      ...databaseUser,
      new: false,
      nickname,
      icon,
      profile: {
        level: 1,
        faction: profile.faction,
        experience: 0,
      },
    };

    await col.findOneAndUpdate({
      _id: mongo.ObjectId(id),
    }, newUserData);

    return true;
  }
);
