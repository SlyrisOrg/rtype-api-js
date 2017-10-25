export default ({ mongo, bcrypt, jwt }, configs) => ({
  getUserData: async (id) => {
    const db = await mongo.MongoClient.connect(configs.database.mongo.uri);
    const col = await db.collection(configs.database.mongo.collections.users);

    const user = await col.findOne({
      _id: mongo.ObjectId(id),
    }, {
      password: false,
    });

    if (!user) {
      throw configs.message.getUserData;
    }

    // Close connection

    db.close();

    return user;
  },

  updateUserData: async (id, data) => {
    const db = await mongo.MongoClient.connect(configs.database.mongo.uri);
    const col = await db.collection(configs.database.mongo.collections.users);

    const user = await col.findOne({
      _id: mongo.ObjectId(id),
    }, {
      password: false,
    });

    // Check if available data

    const availableData = await col.findOne({
      $or: [
        { pseudo: data.pseudo },
        { name: data.name },
        { email: data.email },
      ],
    }, {
      pseudo: true,
      name: true,
      email: true,
    });

    if (availableData) {
      if (availableData.pseudo === data.pseudo) {
        throw configs.message.alreadyTakenPseudo;
      }

      if (availableData.name === data.name) {
        throw configs.message.alreadyTakenName;
      }

      if (availableData.email === data.email) {
        throw configs.message.alreadyTakenEmail;
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

    // Close connection

    db.close();

    return true;
  },

  createUserData: async (id, data) => {
    const db = await mongo.MongoClient.connect(configs.database.mongo.uri);
    const col = await db.collection(configs.database.mongo.collections.users);

    const databaseUser = await col.findOne({
      _id: mongo.ObjectId(id),
    });

    // Check if is new player

    if (!databaseUser.new) {
      throw configs.message.postData;
    }

    // Check if available data

    const availableData = await col.findOne({
      $or: [
        { pseudo: data.pseudo },
        { name: data.name },
        { email: data.email },
      ],
    }, {
      pseudo: true,
      name: true,
      email: true,
    });

    if (availableData) {
      if (availableData.pseudo === data.pseudo) {
        throw configs.message.alreadyTakenPseudo;
      }

      if (availableData.name === data.name) {
        throw configs.message.alreadyTakenName;
      }

      if (availableData.email === data.email) {
        throw configs.message.alreadyTakenEmail;
      }
    }

    // Create data

    const newUserData = {
      ...databaseUser,
      ...data,
      new: false,
    };

    await col.findOneAndUpdate({
      _id: mongo.ObjectId(id),
    }, newUserData);

    // Close connection

    db.close();

    // Send confirmation

    return true;
  },

  signupUser: async (data) => {
    const db = await mongo.MongoClient.connect(configs.database.mongo.uri);
    const col = await db.collection(configs.database.mongo.collections.users);

    // Check if available data

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
        throw configs.message.alreadyTakenName;
      }

      if (availableData.email === data.email) {
        throw configs.message.alreadyTakenEmail;
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


    // Close connection

    db.close();

    if (!isSuccess) {
      throw configs.message.signupUser;
    }

    return true;
  },

  signinUser: async ({ name, email, password }) => {
    const db = await mongo.MongoClient.connect(configs.database.mongo.uri);
    const col = await db.collection(configs.database.mongo.collections.users);

    // Check if email or name of user exist

    const user = await col.findOne({
      $or: [
        { name },
        { email },
      ],
    }, {
      password: true,
    });

    db.close();

    if (!user) {
      throw configs.message.signinUser;
    }

    // Check if password match

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      throw configs.message.signinUser;
    }

    const token = jwt.sign({
      _id: user._id,
    }, configs.server.secret, {
      expiresIn: 48 * 60 * 60,
    });

    return token;
  },
});
