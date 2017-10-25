export default () => ({
  env: process.env.NODE_ENV,
  production: process.env.NODE_ENV === "production",
  port: process.env.PORT,
  locale: "fr",

  secret: process.env.SECRET,
  signature: process.env.SIGNATURE,
});
