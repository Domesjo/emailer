const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const port = process.env.PORT|| 3000;
const compileTemplate = require('./compileTemplate');
const nodemailer = require('nodemailer');
const expressLayouts = require('express-ejs-layouts');
const Promise = require('bluebird');
const pub =  __dirname;
const rp = require('request-promise');

const google = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const clientId = process.env.GMAIL_CLIENT_ID;
const secret = process.env.GMAIL_CLIENT_SECRET;
const redirectUri = 'http://localhost:3000/token';

const oAuth2Client = new OAuth2(
  clientId,
  secret,
  redirectUri
);

google.options({
  auth: oAuth2Client
});

let transporter = {};

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', pub + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static(`${__dirname}/public`));

let template;
let mailOptions = {};

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
  scope: 'https://mail.google.com/'
});

router.get('/auth/google',(req, res)=>{
  res.redirect(url);
});

router.get('/token', (req, res)=>{
  const code = req.query.code;
  oAuth2Client.getToken(code, (err, token)=>{

    if(!err){
      transporter.set('oauth2_provision_cb', (user, renew, callback) => {
        const accessToken = token.access_token;
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

router.post('/generate', (req, res)=>{
  console.log(req.body);
  mailOptions = {
    from: process.env.GMAIL_ADDRESS,
    to: req.body.companyEmail,
    subject: req.body.subject,
    text: compileTemplate(req.body),
    attachments: [{
      filename: req.body.cvFile,
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


router.all('*',(req, res)=> res.redirect('/'));

app.use(router);
app.listen(port, () => console.log(`express is up and running on ${port}`));
