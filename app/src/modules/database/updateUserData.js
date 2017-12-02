export default ({
  configs,
  mongo,
}, client) => (
  async (id, body) => {
    const db = await client;
    const col = await db.collection(configs.database.mongo.collections.users);
    const user = await col.findOne({
      _id: mongo.ObjectId(id),
    }, {
      password: false,
    });

    // Check if available data

    const notAvailableData = await col.findOne({
      $or: [
        { nickname: body.nickname },
        { name: body.name },
        { email: body.email },
      ],
    }, {
      nickname: true,
      name: true,
      email: true,
    });

    if (notAvailableData) {
      if (notAvailableData.nickname === body.nickname) {
        throw configs.response.alreadyTakenNickname;
      }

      if (notAvailableData.name === body.name) {
        throw configs.response.alreadyTakenName;
      }

      if (notAvailableData.email === body.email) {
        throw configs.response.alreadyTakenEmail;
      }
    }

    // Send current user data to database

    const newProfileData = {
      ...user.profile,
      ...body.profile,
    };

    const newShipData = {
      ...user.ship,
      ...body.ship,
    };

    if (!user.availableIcons.find(avalableIcon => avalableIcon === user.icon)) {
      throw configs.response.unavailableIcon;
    }

    const newUserData = {
      ...user,
      ...body,
      profile: newProfileData,
      ship: newShipData,
    };

    await col.findOneAndUpdate({
      _id: mongo.ObjectId(id),
    }, newUserData);

    return true;
  }
);
