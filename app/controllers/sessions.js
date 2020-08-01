const { createRecoveryTokenByUsername, getUsernameFromRecoveryToken } = require('../services/sessions');
const { sendRecoveryEmail } = require('../services/mailer');
const { modifyPasswordMapper } = require('../mappers/sessions');
const { changeUserPassword } = require('../services/users');

exports.createRecoveryToken = ({ body: { email }, user: { userName: username } }, res, next) =>
  createRecoveryTokenByUsername(username)
    .then(token => {
      sendRecoveryEmail({ toEmail: email, token });
      return res.sendStatus(201);
    })
    .catch(next);

exports.modifyPassword = ({ body }, res, next) => {
  const mappedBody = modifyPasswordMapper(body);
  return getUsernameFromRecoveryToken(mappedBody.recoveryToken)
    .then(username => changeUserPassword(username, mappedBody.password))
    .then(() => res.status(200).end())
    .catch(next);
};
