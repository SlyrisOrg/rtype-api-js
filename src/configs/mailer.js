export default () => {
  const credentials = {
    service: "Gmail",
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS,
    },
  };

  const transporter = {
    sender: "RType API server",
    receivers: ["shikalegend@gmail.com"],
  };

  return {
    ...credentials,
    ...transporter,
  };
};
