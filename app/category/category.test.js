/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');

const { expect } = chai;
require('dotenv').config();

chai.use(chaiHttp);

describe('CATEGORY API', () => {
  let categoryId = '';
  let token = '';

  before(async () => {
    const res = await chai.request(app).post('/auth/login')
      .set('Content-Type', 'application/json')
      .send({ email: 'admin@gmail.com' })
      .send({ password: '1234567' });

    token = res.body.token;
  });

  describe('Post /api/categories', () => {
    it('should create new a category correctly', (done) => {
      const categories = [
        'Suggest a feature',
        'Report a problem',
        'Other Category',
      ];

      categories.forEach((category, index) => {
        chai.request(app).post('/api/categories')
          .set('Content-Type', 'application/json')
          .set({ Authorization: `Bearer ${token}` })
          .send({ category_number: (index + 1) })
          .send({ name: category })
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            console.log('BODY:', res.body);
            categoryId = res.body._id;

            if (index === categories.length - 1) done();
          });
      });
    });
  });

  describe('Get /api/categories', () => {
    it('should show categories correctly', (done) => {
      chai.request(app).get('/api/categories')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          console.log('BODY:', res.body);
          done();
        });
    });
  });

  describe('Put /api/categories', () => {
    it('should change a category correctly', (done) => {
      chai.request(app).put(`/api/categories/${categoryId}`)
        .set('Content-Type', 'application/json')
        .set({ Authorization: `Bearer ${token}` })
        .send({ name: 'Other Category 1' })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          console.log('BODY:', res.body);
          done();
        });
    });
  });

  describe('DELETE /api/categories', () => {
    it('should delete a category correctly', (done) => {
      chai.request(app).delete(`/api/categories/${categoryId}`)
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
