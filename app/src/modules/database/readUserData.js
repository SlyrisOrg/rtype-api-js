import { getFactionName } from "../faction";

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

    if (!user.ship || !user.ship.id) {
      return {
        ...user
      };
    }

    return {
      ...user,
      ship: {
        ...user.ship,
        id: getFactionName(user.ship.id)
      }
    };
  }
);
