import { expect } from 'chai';
import request from 'supertest';
import app from '../index.js';

const uniqueUsername = `test_${Date.now()}@gmail.com`;

describe('User Controller /v1/user', function() {
  it('should create a new user and return 201 status code', function(done) {
    request(app)
      .post('/v1/user/')
      .send({
        first_name: 'Test',
        last_name: 'User',
        username: uniqueUsername,
        password: 'password'
      })
      .end(function(err, res) {
        expect(res.statusCode).to.equal(201);
        expect(res.body).to.have.property('success', true);
        expect(res.body).to.have.property('message', 'User created successfully');
        expect(res.body).to.have.nested.property('data.username', uniqueUsername);
        expect(res.body.data).to.include.keys('first_name', 'last_name', 'username', 'account_created', 'account_updated');
        done(err);
      });
  });
  beforeEach(async function() {
    const res = await request(app).get('/v1/user/known_user@example.com');
    if (res.statusCode === 404) {
      await request(app)
        .post('/v1/user/')
        .send({
          first_name: 'Known',
          last_name: 'User',
          username: 'known_user@example.com',
          password: 'password'
        });
    }
  });
  it('should return 400 status code if user already exists', function(done) {
    request(app)
      .post('/v1/user/')
      .send({
        first_name: 'Known',
        last_name: 'User',
        username: 'known_user@example.com',
        password: 'password'
      })
      .end(function(err, res) {
        expect(res.statusCode).to.equal(400);
        done(err);
      });
  });
});

const auth = 'Basic ' + Buffer.from(`${uniqueUsername}:password`).toString('base64');
describe('User Controller /v1/user/self', function() {
  it('should retrieve user information successfully', function(done) {
    request(app)
      .get('/v1/user/self')
      .set('Authorization', auth)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('success', true);
        expect(res.body).to.have.property('message', 'User information retrieved successfully');
        expect(res.body).to.have.nested.property('data.id');
        expect(res.body.data).to.include({
          first_name: 'Test',
          last_name: 'User',
          username: uniqueUsername,
        });
        expect(res.body.data).to.have.property('account_created');
        expect(res.body.data).to.have.property('account_updated');
        done(err);
      });
  });
});

describe('PUT /v1/user/self', function() {
  it('should not update invalid fields', function(done) {
    request(app)
      .put('/v1/user/self')
      .set('Authorization', auth)
      .send({
        invalidField: 'invalidValue'
      })
      .expect(400)
      .end((err, res) => {
        expect(res.body).to.have.property('success', false);
        expect(res.body).to.have.property('message', 'Attempt to update invalid field');
        done(err);
      });
  });

  it('should update user information successfully', function(done) {
    request(app)
      .put('/v1/user/self')
      .set('Authorization', auth)
      .send({
        first_name: 'update_Test',
        last_name: 'update_User',
        username: uniqueUsername,
        password: 'update_password'
      })
      .expect(204)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});