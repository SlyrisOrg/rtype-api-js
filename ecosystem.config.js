const path = require("path");

module.exports = {
  apps: [
    {
      name: "RType-API",
      script: path.resolve(__dirname, "dist", "app.js"),
      watch: true,
      env: {
        NODE_ENV: "development",
        PORT: 8585,
        MONGO_URI: "mongodb://localhost/rtype",
        SIGNATURE: "$2a$10$gTEKbwT/YCFo1HMRb7m2COAxe2uxGKA.n.4JqnTR6WdWf0o4Ppzua",
        SECRET: "6fsY4I9XDvrzZkdE5L5vbvBJpmMZ6GSEVt5EVGYvBXE4vu5BpgqQyfuBdObE",
        MAILER_USER: "unity.shikalegend@gmail.com",
        MAILER_PASS: "234567890",
      },
      env_production: {
        NODE_ENV: "production",
        MONGO_URI: "mongodb://database/rtype",
      },
    },
  ],
};
