const verifyToken = (deps, configs) => async (req, res, next) => {
  const token = req.get("Token");

  try {
    const data = await deps.jwt.verify(token, configs.server.secret);

    if (!data) {
      res.json({
        "success": false,
        "payload": configs.payload.system.unvalidToken,
        "content": {}
      });
    }

    req.user = data.id;
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
      res.json({
        "success": false,
        "payload": configs.payload.system.internalError,
        "content": {}
      });
      return;
    }

    if (!user) {
      res.json({
        "success": false,
        "payload": configs.payload.user.signin,
        "content": {}
      });
      return;
    }

    res.json({
      "success": true,
      "payload": configs.payload.success,
      "content": {
        "new": user.new,
        "token": deps.jwt.sign({
          "id": user._id
        }, configs.server.secret, {
          "expiresIn": 48 * 60 * 60
        }),
        "user": user.profile
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
  });

  try {
    const existingUser = await models.User.findOne({
      "$or": [
        { "name": req.body.name },
        { "email": req.body.email }
      ]
    });

    if (existingUser) {
      res.json({
        "success": false,
        "payload": configs.payload.user.signup,
        "content": {}
      });
      return;
    }

    await user.save();
    res.json({
      "success": true,
      "payload": configs.payload.success,
      "content": {}
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
    const data = await models.User.findById(req.user);

    if (!data) {
      res.json({
        "success": false,
        "payload": configs.payload.user.data.get,
        "content": {}
      });
      return;
    }

    res.json({
      "success": true,
      "payload": configs.payload.success,
      "content": data.profile
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
    const user = await models.User.findById(req.user);
    const newUser = await models.User.findByIdAndUpdate(req.user, {
      "profile": {
        ...user.profile,
        ...req.body
      }
    }, {
      "new": true,
      "upsert": true
    });

    if (!newUser) {
      res.json({
        "success": true,
        "payload": configs.payload.user.data.put,
        "content": {}
      });
    }

    res.json({
      "success": true,
      "payload": configs.payload.success,
      "content": newUser.profile
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
    const user = await models.User.findById(req.user);

    if (!user.new) {
      res.json({
        "success": true,
        "payload": configs.payload.user.data.post,
        "content": {}
      });
      return;
    }

    const existingPseudo = await models.User.find({ "pseudo": req.body.pseudo });

    if (Object.keys(existingPseudo).length) {
      res.json({
        "success": true,
        "payload": configs.payload.input.pseudo.alreadyTaken,
        "content": {}
      });
      return;
    }

    if (!req.body.profile) {
      res.json({
        "success": true,
        "payload": configs.payload.user.data.post,
        "content": {}
      });
      return;
    }

    const newUser = await models.User.findByIdAndUpdate(req.user, {
      "new": false,
      "pseudo": req.body.pseudo,
      "profile": {
        ...user.profile,
        ...req.body.profile
      }
    });

    if (!newUser) {
      res.json({
        "success": true,
        "payload": configs.payload.user.data.post,
        "content": {}
      });
    }

    res.json({
      "success": true,
      "payload": configs.payload.success,
      "content": newUser.profile
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
  const verifyTokenMiddleware = verifyToken(deps, configs);

  router.get("/", verifyTokenMiddleware, getUserData(deps, models, configs));
  router.put("/", verifyTokenMiddleware, updateUserData(deps, models, configs));
  router.post("/", verifyTokenMiddleware, createUserData(deps, models, configs));

  router.post("/signin", signin(deps, models, configs));
  router.post("/signup", signup(deps, models, configs));

  return router;
};
