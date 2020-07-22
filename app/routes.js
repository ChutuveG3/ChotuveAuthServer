const { healthCheck } = require('./controllers/healthCheck');
const { home, end, endWithPrivilege } = require('./controllers/home');
const { signUp, login, viewProfile, getUser, updateProfile } = require('./controllers/users');
const { signUpAdmin, loginAdmin, getUsers } = require('./controllers/admins');
const { registerServer, getServers, deleteServer } = require('./controllers/servers');
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
  validateUser,
  validateSignUpCredentials,
  validateLoginCredentials
} = require('./middlewares/users');
const {
  createAdminSchema,
  createAdminSessionSchema,
  checkAdmin,
  getUsersSchema
} = require('./middlewares/admins');
const {
  registerServerSchema,
  validateApiKey,
  apiKeySchema,
  getServersSchema,
  deleteServerSchema
} = require('./middlewares/servers');
const { validateSchema } = require('./middlewares/params_validator');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/', [], home);
  app.post('/users', [validateSchema(createUserSchema), validateApiKey, validateSignUpCredentials], signUp);
  app.post('/admins', [validateSchema(createAdminSchema)], signUpAdmin);
  app.post(
    '/users/sessions',
    [validateSchema(createUserSessionSchema), validateApiKey, validateLoginCredentials, checkUser],
    login
  );
  app.post('/admins/sessions', [validateSchema(createAdminSessionSchema), checkAdmin], loginAdmin);
  app.get(
    '/connect/access_token_validation',
    [validateSchema(authorizationSchema), validateToken],
    endWithPrivilege
  );
  app.get(
    '/connect/access_token_validation_with_user',
    [validateSchema(authorizationSchema), validateTokenAndLoadUsername],
    getUser
  );
  app.get(
    '/users/:username',
    [validateSchema(viewProfileSchema), validateApiKey, validateToken],
    viewProfile
  );
  app.put(
    '/users/:username',
    [validateSchema(updateProfileSchema), validateApiKey, validateTokenAndLoadUsername, validateUser],
    updateProfile
  );
  app.get('/users', [validateSchema(getUsersSchema), validateToken, checkPrivileges], getUsers);
  app.post(
    '/servers',
    [validateSchema(registerServerSchema), validateToken, checkPrivileges],
    registerServer
  );
  app.get('/connect/api_key_validation', [validateSchema(apiKeySchema), validateApiKey], end);
  app.get('/servers', [validateSchema(getServersSchema), validateToken, checkPrivileges], getServers);
  app.delete(
    '/servers/:name',
    [validateSchema(deleteServerSchema), validateToken, checkPrivileges],
    deleteServer
  );
};
