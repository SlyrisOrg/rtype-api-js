export default () => {
  const basic = {
    env: process.env.NODE_ENV,
    production: process.env.NODE_ENV === "production",
    port: process.env.PORT,
    locale: "fr",
  };

  const request = {
    secret: process.env.SECRET,
    signature: process.env.SIGNATURE,
  };

  return {
    ...basic,
    ...request,
  };
};
