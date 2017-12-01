const getShipStats = (factionId) => {
  switch(factionId) {
    case 0: {
      return {
        health: 1000,
        defense: 100,
        attack: 150,
        moveSpeed: 100,
      };
    }
    case 1: {
      return {
        health: 1500,
        defense: 180,
        attack: 150,
        moveSpeed: 80,
      };
    }
    case 2: {
      return {
        health: 1250,
        defense: 150,
        attack: 50,
        moveSpeed: 150,
      }
    }
  }
}

export default ({
  configs,
  mongo,
}, client) => (
  async (id, {
    nickname,
    icon,
    profile,
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

    if (notAvailableData) {
      if (notAvailableData.nickname === nickname) {
        throw configs.response.alreadyTakenNickname;
      }
    }

    // Init ship
    const ship = getShipStats(profile.faction);

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
      ship: {
        id: profile.ship,
        ...ship
      },
    availableIcons: [0, 1]
    };

    await col.findOneAndUpdate({
      _id: mongo.ObjectId(id),
    }, newUserData);

    return true;
  }
);
