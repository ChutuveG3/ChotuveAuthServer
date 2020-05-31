const { healthCheck } = require('./controllers/healthCheck');
const { home, end } = require('./controllers/home');
const { signup, login, getCurrentUser, updateProfile } = require('./controllers/users');
const { signUpAdmin, loginAdmin } = require('./controllers/admins');
const {
  validateToken,
  validateTokenAndLoadUsername,
  authorizationSchema,
  validateUser
} = require('./middlewares/sessions');
const {
  createUserSchema,
  createUserSessionSchema,
  checkUser,
  getCurrentUserSchema,
  updateProfileSchema
} = require('./middlewares/users');
const { createAdminSchema, createAdminSessionSchema, checkAdmin } = require('./middlewares/admins');
const { validateSchema } = require('./middlewares/params_validator');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/', [], home);
  app.post('/users', [validateSchema(createUserSchema)], signup);
  app.post('/admins', [validateSchema(createAdminSchema)], signUpAdmin);
  app.post('/users/sessions', [validateSchema(createUserSessionSchema), checkUser], login);
  app.post('/admins/sessions', [validateSchema(createAdminSessionSchema), checkAdmin], loginAdmin);
  app.get('/users/me', [validateSchema(getCurrentUserSchema), validateTokenAndLoadUsername], getCurrentUser);
  app.get('/connect/accesstokenvalidation', [validateSchema(authorizationSchema), validateToken], end);
  app.put(
    '/users/:username',
    [validateSchema(updateProfileSchema), validateTokenAndLoadUsername, validateUser],
    updateProfile
  );
};
