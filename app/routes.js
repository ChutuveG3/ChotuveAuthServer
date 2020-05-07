const { healthCheck } = require('./controllers/healthCheck');
const { home } = require('./controllers/home');
const { signup } = require('./controllers/users');
const { signUpAdmin } = require('./controllers/admins');
const { createUserSchema } = require('./middlewares/users');
const { createAdminSchema } = require('./middlewares/admins');
const { validateSchema } = require('./middlewares/params_validator');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/', [], home);
  app.post('/users', [validateSchema(createUserSchema)], signup);
  app.post('/admins', [validateSchema(createAdminSchema)], signUpAdmin);
};
