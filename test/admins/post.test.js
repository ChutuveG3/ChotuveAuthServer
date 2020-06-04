const { getResponse, truncateDatabase } = require('../setup');
const adminFactory = require('../factory/admins');
const { encryptPassword } = require('../../app/services/bcrypt');

const baseUrl = '/admins';
const sessionsUrl = '/admins/sessions';

describe('POST /admins', () => {
  const adminData = {
    first_name: 'fn',
    last_name: 'ln',
    email: 'prueba@prueba.prueba',
    password: 'pass123'
  };
  describe('Missing and invalid parameters', () => {
    describe('Missing one parameter', () => {
      it('Should set status code to 400 and internal code to invalid_params if missing first_name', () => {
        const currentAdminData = { ...adminData };
        delete currentAdminData.first_name;
        return getResponse({ method: 'post', endpoint: baseUrl, body: currentAdminData }).then(res => {
          expect(res.status).toBe(400);
          expect(res.body.message.errors).toHaveLength(1);
          expect(res.body.message.errors[0].param).toBe('first_name');
          expect(res.body.internal_code).toBe('invalid_params');
        });
      });

      it('Should set status code to 400 and internal code to invalid_params if missing last_name', () => {
        const currentAdminData = { ...adminData };
        delete currentAdminData.last_name;
        return getResponse({ method: 'post', endpoint: baseUrl, body: currentAdminData }).then(res => {
          expect(res.status).toBe(400);
          expect(res.body.message.errors).toHaveLength(1);
          expect(res.body.message.errors[0].param).toBe('last_name');
          expect(res.body.internal_code).toBe('invalid_params');
        });
      });

      it('Should set status code to 400 and internal code to invalid_params if missing email', () => {
        const currentAdminData = { ...adminData };
        delete currentAdminData.email;
        return getResponse({ method: 'post', endpoint: baseUrl, body: currentAdminData }).then(res => {
          expect(res.status).toBe(400);
          expect(res.body.message.errors).toHaveLength(1);
          expect(res.body.message.errors[0].param).toBe('email');
          expect(res.body.internal_code).toBe('invalid_params');
        });
      });

      it('Should set status code to 400 and internal code to invalid_params if missing password', () => {
        const currentAdminData = { ...adminData };
        delete currentAdminData.password;
        return getResponse({ method: 'post', endpoint: baseUrl, body: currentAdminData }).then(res => {
          expect(res.status).toBe(400);
          expect(res.body.message.errors).toHaveLength(2);
          expect(res.body.internal_code).toBe('invalid_params');
        });
      });
    });

    describe('Missing multiple parameters', () => {
      it('Should set status code to 400 and internal code to invalid_params if missing multiple params', () =>
        getResponse({ method: 'post', endpoint: baseUrl, body: { first_name: 'fn' } }).then(res => {
          expect(res.status).toBe(400);
          expect(res.body.message.errors).toHaveLength(4);
          expect(res.body.internal_code).toBe('invalid_params');
        }));
    });

    describe('Invalid email', () => {
      it('Should set status code to 400 and internal code to invalid_params if email is invalid', () =>
        getResponse({
          method: 'post',
          endpoint: baseUrl,
          body: { ...adminData, email: 'invalid email' }
        }).then(res => {
          expect(res.status).toBe(400);
          expect(res.body.message.errors).toHaveLength(1);
          expect(res.body.message.errors[0].param).toBe('email');
          expect(res.body.internal_code).toBe('invalid_params');
        }));
    });

    describe('Invalid user_name', () => {
      it('Should set status code to 400 and internal code to invalid_params if first name is invalid', () =>
        getResponse({
          method: 'post',
          endpoint: baseUrl,
          body: { ...adminData, first_name: 5 }
        }).then(res => {
          expect(res.status).toBe(400);
          expect(res.body.message.errors).toHaveLength(1);
          expect(res.body.message.errors[0].param).toBe('first_name');
          expect(res.body.internal_code).toBe('invalid_params');
        }));
    });

    describe('Invalid password: Length less than 6 charcaters', () => {
      it('Check status code', () =>
        getResponse({
          method: 'post',
          endpoint: baseUrl,
          body: { ...adminData, password: 'aaaa' }
        }).then(res => {
          expect(res.status).toBe(400);
          expect(res.body.message.errors).toHaveLength(1);
          expect(res.body.message.errors[0].param).toBe('password');
          expect(res.body.internal_code).toBe('invalid_params');
        }));
    });
  });

  describe('Admin created', () => {
    it('Should set status code to 201 if admin is created successfully', () =>
      getResponse({ method: 'post', endpoint: baseUrl, body: adminData }).then(res => {
        expect(res.status).toBe(201);
      }));
  });

  describe('Admin already exists', () => {
    let admin = {};
    beforeEach(() =>
      truncateDatabase()
        .then(() => adminFactory.create({ email: 'test@test.test' }))
        .then(createdAdmin => (admin = createdAdmin))
    );

    describe('Create admin with repeated email', () => {
      it('Should set status code to 400 and internal code to admin_email_already_exists if admin with that email exists', () =>
        getResponse({ method: 'post', endpoint: baseUrl, body: { ...adminData, email: admin.email } }).then(
          res => {
            expect(res.status).toBe(400);
            expect(res.body.internal_code).toBe('admin_email_already_exists');
          }
        ));
    });
  });
});

describe('POST /admins/sessions', () => {
  const adminData = {
    email: 'test@test.com',
    password: 'MyPassword'
  };

  describe('Missing parameters', () => {
    it('Should be status 400 if email is missing', () => {
      const currentAdminData = { ...adminData };
      delete currentAdminData.email;
      return getResponse({ method: 'post', endpoint: sessionsUrl, body: currentAdminData }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('email');
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });

    it('Should be status 400 if password is missing', () => {
      const currentAdminData = { ...adminData };
      delete currentAdminData.password;
      return getResponse({ method: 'post', endpoint: sessionsUrl, body: currentAdminData }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(2);
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });

    it('Should be status 400 if both email and password are missing', () =>
      getResponse({ method: 'post', endpoint: sessionsUrl, body: {} }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(3);
        expect(res.body.internal_code).toBe('invalid_params');
      }));
  });
  describe('Invalid parameters', () => {
    it('Should be status 400 if email is invalid', () =>
      getResponse({
        method: 'post',
        endpoint: sessionsUrl,
        body: { ...adminData, email: 'invalid email' }
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('email');
        expect(res.body.internal_code).toBe('invalid_params');
      }));

    it('Should be status 400 if password is shorter than 6 characters', () =>
      getResponse({ method: 'post', endpoint: sessionsUrl, body: { ...adminData, password: '1234' } }).then(
        res => {
          expect(res.status).toBe(400);
          expect(res.body.message.errors).toHaveLength(1);
          expect(res.body.message.errors[0].param).toBe('password');
          expect(res.body.internal_code).toBe('invalid_params');
        }
      ));
  });
  describe('Admin does not exists', () => {
    it('Check status code and internal code', () =>
      getResponse({
        endpoint: sessionsUrl,
        method: 'post',
        body: { email: 'noexiste@noexiste.noexiste', password: 'noexiste' }
      }).then(response => {
        expect(response.status).toBe(409);
        expect(response.body.internal_code).toBe('admin_not_exists');
      }));
  });
  describe('Admin exists, password mismatch', () => {
    let admin = {};
    beforeEach(() =>
      truncateDatabase()
        .then(() => adminFactory.create({ email: 'test@test.test', password: '123456' }))
        .then(createdAdmin => (admin = createdAdmin))
    );

    it('Check status code and internal code', () =>
      getResponse({
        endpoint: sessionsUrl,
        method: 'post',
        body: { email: admin.email, password: `${admin.password}a` }
      }).then(response => {
        expect(response.status).toBe(409);
        expect(response.body.internal_code).toBe('password_mismatch');
      }));
  });
  describe('Admin exists, password match', () => {
    let admin = {};
    beforeEach(() =>
      truncateDatabase()
        .then(() => encryptPassword('123456'))
        .then(encriptedPassword =>
          adminFactory.create({ email: 'test@test.test', password: encriptedPassword })
        )
        .then(createdAdmin => (admin = createdAdmin))
    );

    it('Check status code', () =>
      getResponse({
        endpoint: sessionsUrl,
        method: 'post',
        body: { email: admin.email, password: '123456' }
      }).then(response => {
        expect(response.status).toBe(200);
      }));

    it('Check that there is a token', () =>
      getResponse({
        endpoint: sessionsUrl,
        method: 'post',
        body: { email: admin.email, password: '123456' }
      }).then(response => {
        expect(response.body).toHaveProperty('token');
      }));
  });
});
