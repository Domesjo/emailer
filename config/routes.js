const express = require('express');
const multipart = require('connect-multiparty');
const google = require('googleapis');
const router = express.Router();
const OAuth2 = google.auth.OAuth2;
const multiparty = multipart();
const clientId = process.env.GMAIL_CLIENT_ID;
const secret = process.env.GMAIL_CLIENT_SECRET;
const redirectUri = 'http://localhost:3000/token';
const compileTemplate = require('../compileTemplate');
const nodemailer = require('nodemailer');
const Promise = require('bluebird');

const oAuth2Client = new OAuth2(
  clientId,
  secret,
  redirectUri
);

google.options({
  auth: oAuth2Client
});

let transporter = {};
let mailOptions = {};
let template;
router.get('/', (req, res)=>{
  res.status(200).render('home');
});

router.get('/create', (req,res)=>{
  res.status(200).render('index');
});

router.get('/confirmation', (req, res)=>{
  console.log(mailOptions);
  res.status(200).render('coco', {mailOptions});
});


transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: 'OAuth2'
  }
});

const url = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://mail.google.com/', 'https://www.googleapis.com/auth/userinfo.email']
});

router.get('/auth/google',(req, res)=>{
  res.redirect(url);
});

router.get('/token', (req, res)=>{
  const code = req.query.code;

  oAuth2Client.getToken(code, (err, token)=>{
    const accessToken = token.access_token;
    console.log(token);
    if(!err){
      transporter.set('oauth2_provision_cb', (user, renew, callback) => {
        if(!accessToken){
          return callback(new Error('Unknown user'));
        }else{
          return callback(null, accessToken);
        }
      });
      oAuth2Client.setCredentials(token);
    }
    res.redirect('/create');
  });
});

router.post('/generate', multiparty, (req, res)=>{
  console.log(req.files.cvFile);
  mailOptions = {
    from: process.env.GMAIL_ADDRESS,
    to: req.body.companyEmail,
    subject: req.body.subject,
    text: compileTemplate(req.body),
    attachments: [{
      filename: req.files.cvFile.name,
      path: req.files.cvFile.path,
      contentType: 'application/pdf'
    }],
    auth: {
      user: process.env.GMAIL_ADDRESS
    }
  };
  console.log(mailOptions);
  template = mailOptions.text;
  res.redirect('/confirmation');
});


router.post('/generate-email', (req, res) => {
  mailOptions.text = req.body.text;
  new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if(err) return reject(err);
      return resolve(info);
    });
  })
  .then((info) => {
    console.log(info);
    res.redirect('/');
  })
  .catch(err => res.status(500).send(err));
});



router.all('*',(req, res)=> res.redirect('/'));

module.exports = router;
