const { healthCheck } = require('./controllers/healthCheck');
const { home, end } = require('./controllers/home');
const { signUp, login, viewProfile, getUser, updateProfile } = require('./controllers/users');
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
  viewProfileSchema,
  updateProfileSchema,
  validateUser
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
  app.get(
    '/connect/access_token_validation_with_user',
    [validateSchema(authorizationSchema), validateTokenAndLoadUsername],
    getUser
  );
  app.get('/users/:username', [validateSchema(viewProfileSchema), validateToken], viewProfile);
  app.put(
    '/users/:username',
    [validateSchema(updateProfileSchema), validateTokenAndLoadUsername, validateUser],
    updateProfile
  );
  app.get('/users', [validateSchema(getUsersSchema), validateToken, checkPrivileges], getUsers);
};
