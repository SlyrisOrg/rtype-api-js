export default ({
  configs,
  bcrypt,
}, client) => (
  async (data) => {
    const db = await client;
    const col = await db.collection(configs.database.mongo.collections.users);
    const availableData = await col.findOne({
      $or: [
        { name: data.name },
        { email: data.email },
      ],
    }, {
      name: true,
      email: true,
    });

    if (availableData) {
      if (availableData.name === data.name) {
        throw configs.response.alreadyTakenName;
      }

      if (availableData.email === data.email) {
        throw configs.response.alreadyTakenEmail;
      }
    }

    // Inject data in database

    const salt = await bcrypt.genSalt(10);

    const user = {
      new: true,
      name: data.name,
      email: data.email,
      password: await bcrypt.hash(data.password, salt),
    };

    const isSuccess = await col.insertOne(user);

    if (!isSuccess) {
      throw configs.response.signupUser;
    }

    return true;
  }
);
