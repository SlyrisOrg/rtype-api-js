export default () => {
  const mongo = {
    uri: process.env.MONGO_URI,
    collections: {
      users: "users",
    },
  };

  return {
    mongo,
  };
};
