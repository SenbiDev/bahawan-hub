/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');

const { expect } = chai;
require('dotenv').config();
const config = require('../config');

chai.use(chaiHttp);

describe('POST /auth/register', () => {
  before(async () => {
    mongoose.connect(config.mongoUrlTest);
    const { collections } = mongoose.connection;

    await Promise.all(Object.values(collections).map(async (collection) => {
      await collection.deleteMany({});
    }));
  });

  it('should give an error message when the payload does not match', async () => {
    chai.request(app).post('/auth/register')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.be.an('string');
      });
  });

  it('should create a new user correctly', (done) => {
    const users = [
      {
        full_name: 'musenbi',
        email: 'musenbi@gmail.com',
        role: 'user',
        password: 1234567,
      },
      {
        full_name: 'admin',
        email: 'admin@gmail.com',
        role: 'admin',
        password: 1234567,
      },
    ];

    users.forEach((user, index) => {
      chai.request(app).post('/auth/register')
        .set('Content-Type', 'application/json')
        .send({ full_name: user.full_name })
        .send({ email: user.email })
        .send({ role: user.role })
        .send({ password: user.password })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          console.log('BODY:', res.body);
          if (index === users.length - 1) done();
        });
    });
  });

  it('should give an error message when the registered email is available', async () => {
    chai.request(app).post('/auth/register')
      .set('Content-Type', 'application/json')
      .send({ full_name: 'musenbi' })
      .send({ email: 'musenbi@gmail.com' })
      .send({ password: 1234567 })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.be.an('string');
      });
  });
});

describe('POST /auth/login', () => {
  it('should give an error message when the payload does not match', async () => {
    chai.request(app).post('/auth/login')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.be.an('string');
      });
  });

  it('should give an error message when the user is not registered', async () => {
    chai.request(app).post('/auth/login')
      .set('Content-Type', 'application/json')
      .send({ email: 'musenbizzz@gmail.com' })
      .send({ password: '1234567' })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.be.an('string');
      });
  });

  it('should login user correctly', (done) => {
    const users = [
      {
        email: 'admin@gmail.com',
        password: '1234567',
      },
      {
        email: 'musenbi@gmail.com',
        password: '1234567',
      },
    ];

    users.forEach((user, index) => {
      chai.request(app).post('/auth/login')
        .set('Content-Type', 'application/json')
        .send({ email: user.email })
        .send({ password: user.password })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          console.log('BODY:', res.body);
          if (index === users.length - 1) done();
        });
    });
  });
});

describe('POST /auth/me', () => {
  let token = '';

  before(async () => {
    const res = await chai.request(app).post('/auth/login')
      .set('Content-Type', 'application/json')
      .send({ email: 'musenbi@gmail.com' })
      .send({ password: '1234567' });

    token = res.body.token;
  });

  it('should give an error message when the user is not logged in or the token has expired', (done) => {
    chai.request(app).get('/auth/me')
      .end((err, res) => {
        console.log('ERROR ME', res.body);
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should show current user correctly', (done) => {
    chai.request(app).get('/auth/me')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        expect(err).to.be.null;
        console.log('ME', res.body);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });
});

describe('POST /auth/logout', () => {
  let token = '';

  before(async () => {
    const res = await chai.request(app).post('/auth/login')
      .set('Content-Type', 'application/json')
      .send({ email: 'musenbi@gmail.com' })
      .send({ password: '1234567' });

    token = res.body.token;
  });

  it('should give an error message when the token is malformed', (done) => {
    chai.request(app).post('/auth/logout')
      .set({ Authorization: 'Bearer ' })
      .end((err, res) => {
        console.log('ERROR LOGOUT', res.body);
        expect(res).to.have.status(500);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should give an error message when the current token on the client is not the same as the server token', (done) => {
    chai.request(app).post('/auth/logout')
      .set({ Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDc0NTVkOWMxOWZiY2VhYTUyM2I1MGQiLCJmdWxsX25hbWUiOiJtdXNlbmJpIiwiZW1haWwiOiJtdXNlbmJpQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg1MzUwMjU1fQ.q_XgT53o2BvSFshXwhFq0qY1-FdGuoC18ruSqOJgb3o' })
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should logout user correctly', (done) => {
    chai.request(app).post('/auth/logout')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        expect(err).to.be.null;
        console.log('LOGOUT', res.body);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });
});
