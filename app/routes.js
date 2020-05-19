const { healthCheck } = require('./controllers/healthCheck');
const { home } = require('./controllers/home');
const { signup, login, getCurrentUser } = require('./controllers/users');
const { signUpAdmin, loginAdmin } = require('./controllers/admins');
const {
  createUserSchema,
  createUserSessionSchema,
  checkUser,
  getCurrentUserSchema
} = require('./middlewares/users');
const { createAdminSchema, createAdminSessionSchema, checkAdmin } = require('./middlewares/admins');
const { validateSchema } = require('./middlewares/params_validator');
const { validateTokenAndLoadEmail } = require('./middlewares/sessions');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/', [], home);
  app.post('/users', [validateSchema(createUserSchema)], signup);
  app.post('/admins', [validateSchema(createAdminSchema)], signUpAdmin);
  app.post('/users/sessions', [validateSchema(createUserSessionSchema), checkUser], login);
  app.post('/admins/sessions', [validateSchema(createAdminSessionSchema), checkAdmin], loginAdmin);
  app.get('/users/me', [validateSchema(getCurrentUserSchema), validateTokenAndLoadEmail], getCurrentUser);
};
