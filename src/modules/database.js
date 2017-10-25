const getUserData = ({ mongo }, configs) =>
  async (id) => {
    const db = await mongo.MongoClient.connect(configs.database.mongo.uri);
    const col = await db.collection(configs.database.mongo.collections.users);

    const user = await col.findOne({
      _id: mongo.ObjectId(id),
    }, {
      password: false,
    });

    if (!user) {
      throw configs.payload.getUserData;
    }

    // Close connection

    db.close();

    return user;
  };

const updateUserData = ({ mongo }, configs) =>
  async (id, data) => {
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
        throw configs.payload.alreadyTakenPseudo;
      }

      if (availableData.name === data.name) {
        throw configs.payload.alreadyTakenName;
      }

      if (availableData.email === data.email) {
        throw configs.payload.alreadyTakenEmail;
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
  };

const createUserData = ({ mongo }, configs) =>
  async (id, data) => {
    const db = await mongo.MongoClient.connect(configs.database.mongo.uri);
    const col = await db.collection(configs.database.mongo.collections.users);

    const databaseUser = await col.findOne({
      _id: mongo.ObjectId(id),
    });

    // Check if is new player

    if (!databaseUser.new) {
      throw configs.payload.postData;
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
        throw configs.payload.alreadyTakenPseudo;
      }

      if (availableData.name === data.name) {
        throw configs.payload.alreadyTakenName;
      }

      if (availableData.email === data.email) {
        throw configs.payload.alreadyTakenEmail;
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
  };

const signupUser = ({ mongo, bcrypt }, configs) =>
  async (data) => {
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
        throw configs.payload.alreadyTakenName;
      }

      if (availableData.email === data.email) {
        throw configs.payload.alreadyTakenEmail;
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
      throw configs.payload.signupUser;
    }

    return true;
  };

const signinUser = ({ mongo, bcrypt, jwt }, configs) =>
  async ({ name, email, password }) => {
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
      throw configs.payload.signinUser;
    }

    // Check if password match

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      throw configs.payload.signinUser;
    }

    const token = jwt.sign({
      _id: user._id,
    }, configs.server.secret, {
      expiresIn: 48 * 60 * 60,
    });

    return token;
  };

export default (deps, configs) => ({
  getUserData: getUserData(deps, configs),
  updateUserData: updateUserData(deps, configs),
  createUserData: createUserData(deps, configs),
  signupUser: signupUser(deps, configs),
  signinUser: signinUser(deps, configs),
});
