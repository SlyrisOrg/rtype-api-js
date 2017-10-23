/**
 * Get endpoint
 *
 * @param {Object} deps
 * @param {Object} configs
 *
 * @return {Function}
 */
export const get = (deps, configs) => async (req, res) => {
  try {
    // Get current database user data

    const db = await deps.database();
    const col = await db.collection(configs.database.mongo.collection.user);

    const user = await col.findOne({
      "_id": req.user
    }, {
      "password": false
    });

    // Close connection

    db.close();

    // Send data

    res.json({
      "success": true,
      "payload": configs.payload.success,
      "content": user
    });
  } catch (err) {
    deps.logger.error(`Create user error: ${err}`);
    res.json({
      "success": false,
      "payload": configs.payload.system.internalError,
      "message": "Get user data route crashed",
      "content": {},
      "timestamp": new Date()
    });
  }
};

/**
 * Update endpoint
 *
 * @param {Object} deps
 * @param {Object} configs
 *
 * @return {Function}
 */
export const put = (deps, configs) => async (req, res) => {
  try {
    // Get current database user data

    const db = await deps.database();
    const col = await db.collection(configs.database.mongo.collection.user);

    const user = await col.findOne({
      "_id": req.user
    }, {
      "password": false
    });

    // Send current user data to database

    const newUserData = {
      ...user,
      ...req.body
    };

    await col.findOneAndUpdate(req.user, newUserData);

    // Close connection

    db.close();

    // Send confirmation

    res.json({
      "success": true,
      "payload": configs.payload.success,
      "message": "Successfully update user data",
      "content": (!configs.server.production && newUserData) || {},
      "timestamp": new Date()
    });
  } catch (err) {
    deps.logger.error(`Create user error: ${err}`);
    res.json({
      "success": false,
      "payload": configs.payload.system.internalError,
      "message": "Update route cashed",
      "content": {},
      "timestamp": new Date()
    });
  }
};

/**
 * Create user data input checker middleware
 *
 * @param {Object} deps
 * @param {Object} configs
 *
 * @return {Function}
 */
export const postcheckerMiddleware = deps => (req, res, next) => {
  const errors = deps.verifier({
    "pseudo": req.body.pseudo
  });

  if (errors.length) {
    res.json({
      "success": false,
      "payload": errors[0],
      "message": "Not validate input data for user data initalization",
      "content": {},
      "timestamp": new Date()
    });
    return;
  }

  next();
};

/**
 * Create user data endpoint
 *
 * @param {Object} deps
 * @param {Object} configs
 *
 * @return {Function}
 */
export const post = (deps, configs) => async (req, res) => {
  try {
    // Get current database user data

    const db = await deps.database();
    const col = await db.collection(configs.database.mongo.collection.user);

    const databaseUser = await col.findOne({
      "_id": req.user
    });

    // Check if is new player

    if (!databaseUser.new) {
      res.json({
        "success": false,
        "payload": configs.payload.user.data.post,
        "message": "This user have already created an player",
        "content": {},
        "timestamp": new Date()
      });
      return;
    }

    // Check if pseudo is available

    const existingPseudo = await col.findOne({ "pseudo": req.body.pseudo });

    if (existingPseudo) {
      res.json({
        "success": false,
        "payload": configs.payload.input.pseudo.alreadyTaken,
        "message": "Pseudo have already taken in current database",
        "content": {},
        "timestamp": new Date()
      });
      return;
    }

    // Create data

    const newUserData = {
      ...databaseUser,
      "pseudo": req.body.pseudo,
      "profile": req.body.profile,
      "new": false
    };

    await col.findOneAndUpdate({
      "_id": req.user
    }, newUserData);

    // Close connection

    db.close();

    // Send confirmation

    res.json({
      "success": true,
      "payload": configs.payload.success,
      "message": "Successfully create player",
      "content": (!configs.server.production && newUserData) || {},
      "timestamp": new Date()
    });
  } catch (err) {
    deps.logger.error(`Create user error: ${err}`);
    res.json({
      "success": false,
      "payload": configs.payload.system.internalError,
      "message": "Create user data route crashed",
      "content": {},
      "timestamp": new Date()
    });
  }
};
