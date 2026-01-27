const nodemailer = require('nodemailer');
const config = require('../config/config');

const transporter = nodemailer.createTransport({
  service: config.smtpService,
  auth: {
    user: config.smtpUser,
    pass: config.smtpPass,
  },
});

const sendMail = async (mailOptions) => {
  await transporter.sendMail(mailOptions);
};

module.exports = { sendMail };