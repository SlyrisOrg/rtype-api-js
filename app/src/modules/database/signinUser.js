const getFactionName = (id) => {
  switch (id) {
    case 0:
      return "Bheet";
    case 1:
      return "Kooy";
    case 2:
      return "Maul";
    default:
      return "";
  }
}

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

    const { password, ...securedData } = user;

    return {
      ...securedData,
      token,
      profile: {
        ...securedData.profile,
        id: getFactionName(user.profile.id)
      }
    };
  }
);
