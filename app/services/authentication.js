const admin = require('firebase-admin');
const { invalidTokenError } = require('../errors');
const { error, info } = require('../logger');
const {
  firebase: { firebaseConfig }
} = require('../../config').common;

exports.authenticateFirebaseToken = firebaseToken => {
  if (!admin.apps.length) {
    const serviceAccount = JSON.parse(firebaseConfig);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }

  info('Authenticating user');
  return admin
    .auth()
    .verifyIdToken(firebaseToken)
    .catch(err => {
      error(`Firebase token verification failed. ${err}`);
      throw invalidTokenError(`Firebase token verification failed. ${err}`);
    });
};
