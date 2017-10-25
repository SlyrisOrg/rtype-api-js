export default () => ({
  service: "Gmail",
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASS,
  },

  sender: "RType API server",
  receivers: ["shikalegend@gmail.com"],
});
