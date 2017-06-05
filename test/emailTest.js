/*global should, expect, describe, it, beforeEach */
const should = require('chai').should;
const expect = require('chai').expect;
const app = require('supertest')(require('../server'));


beforeEach((done)=>{
  app.get('/auth/google');
  done();
});

describe('GET /create get the create and see if oauth generating', ()=>{
  it('should give us the form page and be authenticated', (done)=>{
    app.get('/create')
    .expect(200, done);
  });
  it('should return a token',(done)=>{
    app.get('/auth/goole')
    .end(()=>{
      app.get('/token')
      .end((err, res)=>{
        console.log(res);
        done();
      });
    });
  });
});

xdescribe('POST /generate ', ()=>{
  it('should create an template and and set the mailOptions', (done)=>{
    app.post('/generate')
      .type('form')
      .send({
        reciver: 'vm.Sam',
        role: 'Full Stack dev',
        city: 'Gotham',
        companyName: 'Wayne Enterprises',
        sector: 'Health',
        paragraph: 'I am sure Bruce wayne looking for devs!',
        framewokrs: 'Angular, React, Dhh',
        favouriteFramework: 'Rails',
        portfolio: 'samdomesjo.com',
        name: 'Sam Domesjö',
        email: 'samdomesjo@gmail.com',
        tel: 'Gagagaga',
        subject: 'Batman are you taking on devs?',
        to: process.env.GMAIL_ADRESS,
        cvFile: 'cv.pdf'
      })
      .end((err, res)=>{
        console.log(res);
        done();
      });
  });
});
