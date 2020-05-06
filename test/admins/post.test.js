const { getResponse, truncateDatabase } = require('../setup');
const adminFactory = require('../factory/admins');

const baseUrl = '/admins';

const adminData = {
  first_name: 'fn',
  last_name: 'ln',
  email: 'prueba@prueba.prueba',
  password: 'pass'
};

describe('POST /admins', () => {
  describe('Missing and invalid parameters', () => {
    describe('Missing one parameter', () => {
      it('Should set status code to 400 and internal code to invalid_params if missing first_name', () => {
        const currentAdminData = { ...adminData };
        delete currentAdminData.first_name;
        getResponse({ method: 'post', endpoint: baseUrl, body: currentAdminData }).then(res => {
          expect(res.status).toBe(400);
          expect(res.body.internal_code).toBe('invalid_params');
        });
      });

      it('Should set status code to 400 and internal code to invalid_params if missing last_name', () => {
        const currentAdminData = { ...adminData };
        delete currentAdminData.last_name;
        getResponse({ method: 'post', endpoint: baseUrl, body: currentAdminData }).then(res => {
          expect(res.status).toBe(400);
          expect(res.body.internal_code).toBe('invalid_params');
        });
      });

      it('Should set status code to 400 and internal code to invalid_params if missing email', () => {
        const currentAdminData = { ...adminData };
        delete currentAdminData.email;
        getResponse({ method: 'post', endpoint: baseUrl, body: currentAdminData }).then(res => {
          expect(res.status).toBe(400);
          expect(res.body.internal_code).toBe('invalid_params');
        });
      });

      it('Should set status code to 400 and internal code to invalid_params if missing password', () => {
        const currentAdminData = { ...adminData };
        delete currentAdminData.password;
        getResponse({ method: 'post', endpoint: baseUrl, body: currentAdminData }).then(res => {
          expect(res.status).toBe(400);
          expect(res.body.internal_code).toBe('invalid_params');
        });
      });
    });

    describe('Missing multiple parameters', () => {
      it('Should set status code to 400 and internal code to invalid_params if missing multiple params', () =>
        getResponse({ method: 'post', endpoint: baseUrl, body: { first_name: 'fn' } }).then(res => {
          expect(res.status).toBe(400);
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

    /*    describe('Create admin with repeated username', () => {
      it('Check status code', () =>
        getResponse({
          method: 'post',
          endpoint: baseUrl,
          body: { ...adminData, user_name: admin.userName }
        }).then(res => {
          expect(res.status).toBe(400);
        }));

      it('Check internal code', () =>
        getResponse({
          method: 'post',
          endpoint: baseUrl,
          body: { ...adminData, user_name: admin.userName }
        }).then(res => {
          expect(res.body.internal_code).toBe('admin_user_name_already_exists');
        }));
    });*/
  });
});
