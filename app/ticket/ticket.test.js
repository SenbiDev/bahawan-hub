/* eslint-disable no-console */
/* eslint-disable no-return-await */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');

const { expect } = chai;
require('dotenv').config();

chai.use(chaiHttp);

describe('TICKET API', () => {
  let ticketId = '';

  describe('User Role', () => {
    let token = '';

    before(async () => {
      const res = await chai.request(app).post('/auth/login')
        .set('Content-Type', 'application/json')
        .send({ email: 'musenbi@gmail.com' })
        .send({ password: '1234567' });

      token = res.body.token;
    });

    describe('Post /api/tickets-user', () => {
      it('should create new a ticket correctly', (done) => {
        const requestList = [
          {
            summary: 'Suggest a new feature',
            detail: 'I suggest ....',
            category_number: 1,
          },
          {
            summary: 'Problem a C feature',
            detail: 'the problem is ....',
            category_number: 2,
          },
          {
            summary: 'Problem a E feature',
            detail: 'the problem is ....',
            category_number: 2,
          },
        ];

        requestList.forEach((request, index) => {
          chai.request(app).post('/api/tickets-user')
            .set('Content-Type', 'application/json')
            .set({ Authorization: `Bearer ${token}` })
            .send({ summary: request.summary })
            .send({ detail: request.detail })
            .send({ category_number: request.category_number })
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res).to.have.status(201);
              expect(res.body).to.be.an('object');
              console.log('BODY:', res.body);
              ticketId = res.body._id;
              if (index === requestList.length - 1) done();
            });
        });
      });
    });

    describe('Get /api/tickets-user', () => {
      it('should show tickets correctly', (done) => {
        chai.request(app).get('/api/tickets-user')
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            console.log('BODY:', res.body);
            done();
          });
      });
    });
  });

  describe('Admin Role', () => {
    let token = '';

    before(async () => {
      const res = await chai.request(app).post('/auth/login')
        .set('Content-Type', 'application/json')
        .send({ email: 'admin@gmail.com' })
        .send({ password: '1234567' });

      token = res.body.token;
    });

    after(async () => await mongoose.connection.close());

    describe('Put /api/tickets-admin', () => {
      it('should change a category priority correctly', (done) => {
        chai.request(app).put(`/api/tickets-admin/${ticketId}`)
          .set('Content-Type', 'application/json')
          .set({ Authorization: `Bearer ${token}` })
          .send({ is_priority: true })
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            console.log('BODY:', res.body);
            done();
          });
      });
    });

    describe('Put /api/tickets-admin', () => {
      it('should change a category status correctly', (done) => {
        chai.request(app).put(`/api/tickets-admin/${ticketId}`)
          .set('Content-Type', 'application/json')
          .set({ Authorization: `Bearer ${token}` })
          .send({ status: 'telah selesai' })
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            console.log('BODY:', res.body);
            done();
          });
      });
    });

    describe('Get /api/tickets-admin', () => {
      it('should show tickets correctly', (done) => {
        chai.request(app).get('/api/tickets-admin')
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            console.log('BODY:', res.body);
            done();
          });
      });
    });
  });
});
