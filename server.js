const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const port = process.env.PORT|| 3000;
const compileTemplate = require('./compileTemplate');
const nodemailer = require('nodemailer');
const Promise = require('bluebird');
const pub =  __dirname;
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_ADDRESS,
    auth: process.env.GMAIL_PASSWORD,
    pass: process.env.GMAIL_PASSWORD
  }
});

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', pub + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static(pub));

let template;
let mailOptions = {};

router.post('/generate', (req, res)=>{
  mailOptions = {
    from: req.body.email,
    to: req.body.companyEmail,
    subject: req.body.subject,
    text: compileTemplate(req.body)
  };
  template = mailOptions.text;

  res.redirect('/confirmation');
});



router.post('/generate-email', (req, res) => {
  console.log(mailOptions);
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

router.get('/', (req,res)=>{
  res.status(200).render('index');
});

router.get('/confirmation', (req, res)=>{
  res.status(200).render('coco', {mailOptions});
});

app.use(router);
app.listen(3000, () => console.log(`express is up and running on ${port}`));
