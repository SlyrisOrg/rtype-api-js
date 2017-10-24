const alert = ({ nodemailer, logger }, configs) =>
  async (error) => {
    const now = new Date();

    const smtpTransport = nodemailer.createTransport("SMTP", {
      service: configs.mailer.service,
      auth: configs.mailer.auth,
    });

    const mailOptions = {
      from: configs.mailer.sender,
      to: configs.mailer.receivers.join(", "), // list of receivers
      subject: `ERROR: ${now}`,
      html: `<p>${error}</p>`,
    };

    try {
      await smtpTransport.sendMail(mailOptions);
    } catch (err) {
      logger.error(err);
    }
  };

export default (deps, configs) => ({
  alert: alert(deps, configs),
});
