/**
 * Signup input checker middleware
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
      "message": `Coudln't ${errors.length} validate input data for signup`,
      "content": {},
      "timestamp": new Date()
    });
    return;
  }

  next();
};

/**
 * Signup endpoint
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

    // Check if email or name is already taken

    const existingUser = await col.findOne({
      "$or": [
        { "name": req.body.name },
        { "email": req.body.email }
      ]
    });

    if (existingUser) {
      if (existingUser.name === req.body.name) {
        res.json({
          "success": false,
          "payload": configs.payload.input.name.alreadyTaken,
          "message": "This username already exist in current database state",
          "content": {},
          "timestamp": new Date()
        });
        return;
      }

      if (existingUser.email === req.body.email) {
        res.json({
          "success": false,
          "payload": configs.payload.input.email.alreadyTaken,
          "message": "This email already exist in current database state",
          "content": {},
          "timestamp": new Date()
        });
        return;
      }
    }

    // Inject data in database

    const salt = deps.bcrypt.genSaltSync(10);

    const user = {
      "new": true,
      "name": req.body.name,
      "email": req.body.email,
      "password": deps.bcrypt.hashSync(req.body.password, salt)
    };

    col.insertOne(user);

    // Close connection

    db.close();

    // Send confirmation

    res.json({
      "success": true,
      "payload": configs.payload.success,
      "message": "Succesfully create account",
      "content": (!configs.server.production && user) || {},
      "timestamp": new Date()
    });
  } catch (err) {
    deps.logger.error(`Signup user error: ${err}`);
    res.json({
      "success": false,
      "payload": configs.payload.system.internalError,
      "message": "Signup route crashed",
      "content": {},
      "timestamp": new Date()
    });
  }
};
