const { createRecoveryTokenByUsername } = require('../services/sessions');
const { sendRecoveryEmail } = require('../services/mailer');

exports.createRecoveryToken = ({ body: { email }, user: { userName: username } }, res, next) =>
  createRecoveryTokenByUsername(username)
    .then(token => {
      // console.log(token, email);
      sendRecoveryEmail({ toEmail: email, token });
      return res.sendStatus(201);
    })
    .catch(next);
