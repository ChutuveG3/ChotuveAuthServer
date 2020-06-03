const { healthCheck } = require('./controllers/healthCheck');
const { home, end } = require('./controllers/home');
const { signUp, login, getCurrentUser, updateProfile } = require('./controllers/users');
const { signUpAdmin, loginAdmin, getUsers } = require('./controllers/admins');
const {
  validateToken,
  validateTokenAndLoadUsername,
  authorizationSchema,
  checkPrivileges
} = require('./middlewares/sessions');
const {
  createUserSchema,
  createUserSessionSchema,
  checkUser,
  getCurrentUserSchema,
  updateProfileSchema
} = require('./middlewares/users');
const {
  createAdminSchema,
  createAdminSessionSchema,
  checkAdmin,
  getUsersSchema
} = require('./middlewares/admins');
const { validateSchema } = require('./middlewares/params_validator');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/', [], home);
  app.post('/users', [validateSchema(createUserSchema)], signUp);
  app.post('/admins', [validateSchema(createAdminSchema)], signUpAdmin);
  app.post('/users/sessions', [validateSchema(createUserSessionSchema), checkUser], login);
  app.post('/admins/sessions', [validateSchema(createAdminSessionSchema), checkAdmin], loginAdmin);
  app.get('/connect/access_token_validation', [validateSchema(authorizationSchema), validateToken], end);
  app.get('/users/me', [validateSchema(getCurrentUserSchema), validateTokenAndLoadUsername], getCurrentUser);
  app.put('/users/me', [validateSchema(updateProfileSchema), validateTokenAndLoadUsername], updateProfile);
  app.get('/users', [validateSchema(getUsersSchema), validateToken, checkPrivileges], getUsers);
};
