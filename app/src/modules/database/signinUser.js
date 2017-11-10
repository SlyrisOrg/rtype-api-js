export default ({
  configs,
  bcrypt,
  jwt,
}, client) => (
  async (data) => {
    const db = await client;
    const col = await db.collection(configs.database.mongo.collections.users);
    const user = await col.findOne({
      $or: [
        { name: data.name },
        { email: data.email },
      ],
    });

    if (!user) {
      throw configs.response.signinUser;
    }

    // Check if password match

    const isMatch = bcrypt.compareSync(data.password, user.password);

    if (!isMatch) {
      throw configs.response.signinUser;
    }

    const token = jwt.sign({
      _id: user._id,
    }, configs.server.secret, {
      expiresIn: 48 * 60 * 60,
    });

    return {
      ...user,
      token,
    };
  }
);
