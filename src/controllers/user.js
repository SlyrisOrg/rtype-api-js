const verifyTokenMiddleware = (deps, configs) => async (req, res, next) => {
  try {
    const data = await deps.jwt.verify(req.get("Token"), configs.server.secret);

    if (!data || !data._id) {
      res.json({
        "success": false,
        "payload": configs.payload.system.unvalidToken,
        "content": {}
      });
    }

    req.user = deps.mongo.ObjectId(data._id);
    next();
  } catch (err) {
    deps.logger.error(`Token verify error: ${err}`);
    res.json({
      "success": false,
      "payload": configs.payload.system.unvalidToken,
      "content": {}
    });
  }
};

const signin = (deps, models, configs) => async (req, res, next) => {
  req.assert("name", configs.payload.input.name.empty).notEmpty();
  req.assert("name", configs.payload.input.name.badFormat).isLength({ "min": 3, "max": 20 });
  req.assert("name", configs.payload.input.name.badFormat).isAlphanumeric();

  req.assert("password", configs.payload.input.password.empty).notEmpty();
  req.assert("password", configs.payload.input.password.badFormat).isLength({ "min": 4, "max": 16 });

  const errors = req.validationErrors();

  if (errors.length) {
    const allErrors = errors.map(e => e.msg);

    res.json({
      "success": false,
      "payload": allErrors[0],
      "content": {}
    });
    return;
  }

  deps.passport.authenticate("local", { "session": false }, (err, user) => {
    if (err) {
      deps.logger.error(`Passport local error: ${err}`);
      res.json({
        "success": false,
        "payload": configs.payload.user.signin,
        "content": {}
      });
      return;
    }

    const token = deps.jwt.sign({
      "_id": user.get("_id")
    }, configs.server.secret, {
      "expiresIn": 48 * 60 * 60
    });

    res.json({
      "success": true,
      "payload": configs.payload.success,
      "content": {
        "new": user.get("new"),
        "token": token,
        "user": user.get("profile")
      }
    });
  })(req, res, next);
};

const signup = (deps, models, configs) => async (req, res) => {
  req.assert("name", configs.payload.input.name.empty).notEmpty();
  req.assert("name", configs.payload.input.name.badFormat).isLength({ "min": 3, "max": 20 });
  req.assert("name", configs.payload.input.name.badFormat).isAlphanumeric();

  req.assert("password", configs.payload.input.password.empty).notEmpty();
  req.assert("password", configs.payload.input.password.badFormat).isLength({ "min": 4, "max": 16 });

  req.assert("email", configs.payload.input.email.empty).notEmpty();
  req.assert("email", configs.payload.input.email.badFormat).isEmail();
  req.sanitize("email").normalizeEmail({ "gmail_remove_dots": false });

  const errors = req.validationErrors();

  if (errors.length) {
    const allErrors = errors.map(e => e.msg);

    res.json({
      "success": false,
      "payload": allErrors[0],
      "content": {}
    });
    return;
  }

  const user = new models.User({
    "name": req.body.name,
    "email": req.body.email,
    "password": req.body.password
  }).hashPassword();

  try {
    const db = await deps.database();
    const col = await db.collection(configs.database.mongo.collection.user);

    const existingUser = await col.findOne({
      "$or": [
        { "name": user.get("name") },
        { "email": user.get("email") }
      ]
    });

    if (existingUser) {
      if (existingUser.name === user.get("name")) {
        res.json({
          "success": false,
          "payload": configs.payload.input.name.alreadyTaken,
          "content": {}
        });
        return;
      }

      if (existingUser.email === user.get("email")) {
        res.json({
          "success": false,
          "payload": configs.payload.input.email.alreadyTaken,
          "content": {}
        });
        return;
      }
    }

    col.insertOne(user.get());

    db.close();

    res.json({
      "success": true,
      "payload": configs.payload.success,
      "content": user.get()
    });
  } catch (err) {
    deps.logger.error(`Signup user error: ${err}`);
    res.json({
      "success": false,
      "payload": configs.payload.system.internalError,
      "content": {}
    });
  }
};

const getUserData = (deps, models, configs) => async (req, res) => {
  try {
    const db = await deps.database();
    const col = await db.collection(configs.database.mongo.collection.user);

    const databaseUser = await col.findOne({ "_id": req.user });

    db.close();

    const user = new models.User(databaseUser);

    res.json({
      "success": true,
      "payload": configs.payload.success,
      "content": user.get()
    });
  } catch (err) {
    deps.logger.error(`Get user error: ${err}`);
    res.json({
      "success": false,
      "payload": configs.payload.user.system.internalError,
      "content": {}
    });
  }
};

const updateUserData = (deps, models, configs) => async (req, res) => {
  try {
    const db = await deps.database();
    const col = await db.collection(configs.database.mongo.collection.user);

    const databaseUser = await col.findOne({ "_id": req.user });

    const user = new models.User({
      ...databaseUser,
      ...req.body
    });

    await col.findOneAndUpdate(req.user, user.get());

    db.close();

    res.json({
      "success": true,
      "payload": configs.payload.success,
      "content": user.get()
    });
  } catch (err) {
    deps.logger.error(`Update user error: ${err}`);
    res.json({
      "success": false,
      "payload": configs.payload.system.internalError,
      "content": {}
    });
  }
};

const createUserData = (deps, models, configs) => async (req, res) => {
  req.assert("pseudo", configs.payload.input.pseudo.empty).notEmpty();
  req.assert("pseudo", configs.payload.input.pseudo.badFormat).isLength({ "min": 3, "max": 20 });
  req.assert("pseudo", configs.payload.input.pseudo.badFormat).isAlphanumeric();

  const errors = req.validationErrors();

  if (errors.length) {
    const allErrors = errors.map(e => e.msg);

    res.json({
      "success": false,
      "payload": allErrors[0],
      "content": {}
    });
    return;
  }

  try {
    const db = await deps.database();
    const col = await db.collection(configs.database.mongo.collection.user);

    const databaseUser = await col.findOne({ "_id": req.user });

    const user = new models.User({
      ...databaseUser,
      ...req.body
    });

    if (!user.get("new")) {
      res.json({
        "success": false,
        "payload": configs.payload.user.data.post,
        "content": {}
      });
      return;
    }

    const existingPseudo = await col.findOne({ "pseudo": req.body.pseudo });

    if (existingPseudo) {
      res.json({
        "success": false,
        "payload": configs.payload.input.pseudo.alreadyTaken,
        "content": {}
      });
      return;
    }

    const newUser = new models.User({
      ...user.get(),
      "_id": user.get("_id"),
      "new": false
    });

    await col.findOneAndUpdate({
      "_id": user.get("_id")
    }, newUser.get());

    db.close();

    res.json({
      "success": true,
      "payload": configs.payload.success,
      "content": newUser.get()
    });
  } catch (err) {
    deps.logger.error(`Create user error: ${err}`);
    res.json({
      "success": false,
      "payload": configs.payload.system.internalError,
      "content": {}
    });
  }
};

export default (deps, models, configs) => (router) => {
  router.get("/", verifyTokenMiddleware(deps, configs), getUserData(deps, models, configs));
  router.put("/", verifyTokenMiddleware(deps, configs), updateUserData(deps, models, configs));
  router.post("/", verifyTokenMiddleware(deps, configs), createUserData(deps, models, configs));

  router.post("/signin", signin(deps, models, configs));
  router.post("/signup", signup(deps, models, configs));

  return router;
};
