/*global should, expect, describe, it, beforeEach */
const should = require('chai').should;
const expect = require('chai').expect;
const app = require('supertest')(require('../server'));
const compileTemplate = require('../compileTemplate');
const TD = {
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
};
beforeEach((done)=>{
  app.get('/auth/google');
  app.get('/token');
  done();
});

describe('GET /create get the create and see if oauth generating', ()=>{
  it('should give us the form page and be authenticated', (done)=>{
    app.get('/create')
    .expect(200, done);
  });

  it('should render a from with enctype="Mulitpart/form-data", and have a submit', (done)=>{
    app.get('/create')
    .end((err, res)=>{
      expect(res.text).to.contain('<form action="/generate" method="POST" class="row" enctype="multipart/form-data" role="form">');
      expect(res.text).to.contain('<button type="submit" name="button">Submit</button>');
      done();
    });
  });
  it('It should have all the input fields and the right name', (done)=>{
    app.get('/create')
    .end((err, res)=>{
      expect(res.text).to.contain('name="email"');
      expect(res.text).to.contain('for="email"');
      expect(res.text).to.contain('name="companyEmail"');
      expect(res.text).to.contain('for="companyEmail"');
      expect(res.text).to.contain('name="subject"');
      expect(res.text).to.contain('for="subject"');
      expect(res.text).to.contain('name="reciver"');
      expect(res.text).to.contain('for="reciver"');
      expect(res.text).to.contain('name="role"');
      expect(res.text).to.contain('for="role"');
      expect(res.text).to.contain('name="city"');
      expect(res.text).to.contain('for="city"');
      expect(res.text).to.contain('name="sector"');
      expect(res.text).to.contain('for="sector"');
      expect(res.text).to.contain('name="paragraph"');
      expect(res.text).to.contain('for="paragraph"');
      expect(res.text).to.contain('name="companyName"');
      expect(res.text).to.contain('for="companyName"');
      expect(res.text).to.contain('name="frameworks"');
      expect(res.text).to.contain('for="frameworks"');
      expect(res.text).to.contain('name="favouriteFramework"');
      expect(res.text).to.contain('for="favouriteFramework"');
      expect(res.text).to.contain('name="portfolio"');
      expect(res.text).to.contain('for="portfolio"');
      expect(res.text).to.contain('name="name"');
      expect(res.text).to.contain('for="name"');
      expect(res.text).to.contain('name="tel"');
      expect(res.text).to.contain('for="tel"');
      expect(res.text).to.contain('for="cvFile"');
      expect(res.text).to.contain('name="cvFile"');
      expect(res.text).to.contain('type="sfile"');
      done();
    });
  });
});


describe('Should compile the text', ()=>{
  it('should compile the template to an email', (done)=>{
    const ans = `vm.Sam,

I wanted to get in touch about the Full Stack dev role to join your team here in Gotham.
I find Wayne Enterprises is doing some ground breaking work in Health, which is super exciting.

I am sure Bruce wayne looking for devs!

I have just graduated from an immersive program at General Assembly in Web Development. I enjoy working with different frameworks and libraries both on the back-end and front-end, I have experience using undefined which I both find very interesting to use. I find Rails slightly more enjoyable because of it is less naming conventions and opinionated.
Overall I find back-end problems more appealing because making these to work, and interact with each other feels super rewarding.


My CV is attached to this application.
Here is a link to my portfolio
samdomesjo.com

If there is any questions please do not hesitate to contact me, I’d love to resolve any uncertainties.
Sincerely yours,

Sam Domesjö
samdomesjo@gmail.com
Gagagaga

Created by Emailer
`;
    expect(compileTemplate(TD)).to.equal(ans);
    done();
  });
});
