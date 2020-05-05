const { getResponse, truncateDatabase } = require('../setup');
const adminFactory = require('../factory/admins');

const baseUrl = '/admins';

const adminData = {
  email: 'prueba@prueba.prueba',
  password: 'pass',
  user_name: 'un'
};

const adminDataMissingParam = {
  password: 'pass',
  user_name: 'un'
};

describe('POST /admins', () => {
  describe('Missing and invalid parameters', () => {
    describe('Missing one parameter', () => {
      it('Check status code', () =>
        getResponse({ method: 'post', endpoint: baseUrl, body: adminDataMissingParam }).then(res => {
          expect(res.status).toBe(400);
        }));

      it('Check internal code', () =>
        getResponse({ method: 'post', endpoint: baseUrl, body: adminDataMissingParam }).then(res => {
          expect(res.body.internal_code).toBe('invalid_params');
        }));
    });

    describe('Missing multiple parameters', () => {
      it('Check status code', () =>
        getResponse({ method: 'post', endpoint: baseUrl, body: { user_name: 'un' } }).then(res => {
          expect(res.status).toBe(400);
        }));

      it('Check internal code', () =>
        getResponse({ method: 'post', endpoint: baseUrl, body: { user_name: 'un' } }).then(res => {
          expect(res.body.internal_code).toBe('invalid_params');
        }));
    });

    describe('Invalid email', () => {
      it('Check status code', () =>
        getResponse({
          method: 'post',
          endpoint: baseUrl,
          body: { ...adminData, email: 'invalid email' }
        }).then(res => {
          expect(res.status).toBe(400);
        }));

      it('Check internal code', () =>
        getResponse({
          method: 'post',
          endpoint: baseUrl,
          body: { ...adminData, email: 'invalid email' }
        }).then(res => {
          expect(res.body.internal_code).toBe('invalid_params');
        }));
    });

    describe('Invalid user_name', () => {
      it('Check status code', () =>
        getResponse({
          method: 'post',
          endpoint: baseUrl,
          body: { ...adminData, user_name: 5 }
        }).then(res => {
          expect(res.status).toBe(400);
        }));

      it('Check internal code', () =>
        getResponse({
          method: 'post',
          endpoint: baseUrl,
          body: { ...adminData, user_name: 5 }
        }).then(res => {
          expect(res.body.internal_code).toBe('invalid_params');
        }));
    });
  });

  describe('Admin created', () => {
    it('Correct creation, check status code', () =>
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
      it('Check status code', () =>
        getResponse({ method: 'post', endpoint: baseUrl, body: { ...adminData, email: admin.email } }).then(
          res => {
            expect(res.status).toBe(400);
          }
        ));

      it('Check internal code', () =>
        getResponse({ method: 'post', endpoint: baseUrl, body: { ...adminData, email: admin.email } }).then(
          res => {
            expect(res.body.internal_code).toBe('admin_email_already_exists');
          }
        ));
    });

    describe('Create admin with repeated username', () => {
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
    });
  });
});
