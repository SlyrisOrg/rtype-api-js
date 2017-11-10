export default ({
  configs,
  mongo,
}, client) => (
  async (id, {
    nickname, name, email, profile,
  }) => {
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
        { nickname },
        { name },
        { email },
      ],
    }, {
      nickname: true,
      name: true,
      email: true,
    });

    if (availableData) {
      if (availableData.nickname === nickname) {
        throw configs.response.alreadyTakenNickname;
      }

      if (availableData.name === name) {
        throw configs.response.alreadyTakenName;
      }

      if (availableData.email === email) {
        throw configs.response.alreadyTakenEmail;
      }
    }

    // Send current user data to database

    const newUserData = {
      ...user,
      profile: {
        level: profile.level,
        faction: profile.faction,
        experience: profile.experience,
        idIcon: profile.idIcon,
      },
    };

    await col.findOneAndUpdate({
      _id: mongo.ObjectId(id),
    }, newUserData);

    return true;
  }
);
