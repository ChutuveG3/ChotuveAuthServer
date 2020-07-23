const nodemailer = require('nodemailer');
const { error, info } = require('../logger');
const { generateRecoveryEmail } = require('../utils/emailGenerator');
const {
  recovery: { senderEmail, senderPassword, subject }
} = require('../../config').common;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: senderEmail,
    pass: senderPassword
  }
});

exports.sendRecoveryEmail = ({ toEmail, token }) => {
  info('Sending recovery token');
  const mailOptions = {
    from: senderEmail,
    to: toEmail,
    subject,
    html: generateRecoveryEmail(token)
  };

  transporter.sendMail(mailOptions, err => {
    if (err) {
      error(err);
    } else {
      info('Email sent correctly');
    }
  });
};
