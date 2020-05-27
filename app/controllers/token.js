const { info } = require('../logger');
const { validateToken } = require('../middlewares/sessions');

exports.validateToken = (req, res, next) => {
  info('Validating token');
  try {
    validateToken(req.headers.authorization);
    return res.status(200).end();
  } catch (err) {
    return next(err);
  }
};
