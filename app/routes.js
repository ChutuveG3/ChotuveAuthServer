const { healthCheck } = require('./controllers/healthCheck');
const { home } = require('./controllers/home');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/', [], home);
};
