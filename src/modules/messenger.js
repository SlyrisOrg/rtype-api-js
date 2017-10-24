export default configs =>
  (req, res, next) => {
    res.error = (json) => {
      res.json({
        success: false,
        payload: configs.payload.internalError,
        message: configs.message.internalError,
        content: {},
        timestamp: new Date(),
        ...json,
      });
    };

    res.success = (json) => {
      res.json({
        success: true,
        payload: configs.payload.success,
        message: configs.message.success,
        content: {},
        timestamp: new Date(),
        ...json,
      });
    };

    next();
  };
