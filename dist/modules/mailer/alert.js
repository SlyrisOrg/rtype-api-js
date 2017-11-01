"use strict";Object.defineProperty(exports,"__esModule",{value:!0});exports.default=({nodemailer,configs,logger})=>async error=>{const now=new Date;const smtpTransport=nodemailer.createTransport("SMTP",{service:configs.mailer.service,auth:configs.mailer.auth});const mailOptions={from:configs.mailer.sender,to:configs.mailer.receivers.join(", "),subject:`ERROR: ${now}`,html:`<p>${error}</p>`};try{await smtpTransport.sendMail(mailOptions)}catch(err){logger.error(err)}};