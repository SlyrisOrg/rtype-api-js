export default () => ({
  mongo: {
    uri: process.env.MONGO_URI,
    collections: {
      users: "users",
    },
  },
});
