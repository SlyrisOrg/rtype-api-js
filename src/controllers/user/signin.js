/**
 * Signin input checker middleware
 *
 * @param {Object} deps
 * @param {Object} configs
 *
 * @return {Function}
 */
export const postCheckerMiddleware = deps => (req, res, next) => {
  const errors = deps.verifier({
    "name": req.body.name,
    "password": req.body.password,
    "email": req.body.email
  });

  if (errors.length) {
    res.json({
      "success": false,
      "payload": errors[0],
      "message": `Couldn't ${errors.length} validate input data for signin`,
      "content": {},
      "timestamp": new Date()
    });
    return;
  }

  next();
};

/**
 * Signin endpoint
 *
 * @param {Object} deps
 * @param {Object} configs
 *
 * @return {Function}
 */
export const post = (deps, configs) => async (req, res) => {
  try {
    // Get current user data

    const db = await deps.database();
    const col = await db.collection(configs.database.mongo.collection.user);

    // Check if email or name of user exist

    const user = await col.findOne({
      "$or": [
        { "name": req.body.name },
        { "email": req.body.email }
      ]
    });

    if (!user) {
      res.json({
        "success": true,
        "payload": configs.payload.user.signin,
        "message": "Unmatch credentials",
        "content": {},
        "timestamp": new Date()
      });
      return;
    }

    // Check if password match

    const isMatch = deps.bcrypt.compareSync(req.body.password, user.password);

    if (!isMatch) {
      res.json({
        "success": false,
        "payload": configs.payload.user.signin,
        "message": "Wrong credentials",
        "content": {},
        "timestamp": new Date()
      });
      return;
    }

    // Prepare and send token

    const token = deps.jwt.sign({
      "_id": user._id
    }, configs.server.secret, {
      "expiresIn": 48 * 60 * 60
    });

    res.json({
      "success": true,
      "payload": configs.payload.success,
      "message": "",
      "content": {
        "new": user.new,
        "token": token,
        "user": user.profile
      },
      "timestamp": new Date()
    });
  } catch (err) {
    deps.logger.error(`Signin user error: ${err}`);
    res.json({
      "success": false,
      "payload": configs.payload.system.internalError,
      "message": "Signin route crashed",
      "content": {},
      "timestamp": new Date()
    });
  }
};
