const express = require('express');
const multipart = require('connect-multiparty');
const router = express.Router();
const multiparty = multipart();
const compileTemplate = require('../compileTemplate');
const compileFollowUp = require('../compileFollowUp');
const nodemailer = require('nodemailer');
const Promise = require('bluebird');
const {url, oAuth2Client} = require('./gmail');

let transporter = {};
let mailOptions = {};
let template;

transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: 'OAuth2'
  }
});


router.get('/auth/google',(req, res)=>{
  res.redirect(url);
});

router.get('/', (req, res)=>{
  res.status(200).render('home');
});

router.get('/create', (req,res)=>{
  res.status(200).render('index');
});
router.get('/create/followUp', (req,res)=>{
  res.status(200).render('followUp');
});

router.get('/confirmation', (req, res)=>{
  console.log(mailOptions);
  res.status(200).render('coco', {mailOptions});
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
  let compiler;
  switch(true){
    case req.body.emailType === 'followUp':
      compiler = compileFollowUp;
      break;
    default:
      compiler = compileTemplate;
  }
  mailOptions = {
    from: process.env.GMAIL_ADDRESS,
    to: req.body.companyEmail,
    subject: req.body.subject,
    text: compiler(req.body),
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
