const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const port = process.env.PORT|| 3000;
const compileTemplate = require('./compileTemplate');
const nodemailer = require('nodemailer');
const Promise = require('bluebird');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_ADDRESS,
    auth: process.env.GMAIL_PASSWORD,
    pass: process.env.GMAIL_PASSWORD
  }
});

const app = express();

app.use(morgan());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


router.post('/generate-email', (req, res) => {
  const mailOptions = {
    from: req.body.email,
    to: req.body.companyEmail,
    subject: req.body.subject,
    text: compileTemplate(req.body)
  };

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

app.set('views', __dirname);
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/views'));


router.get('/', (req,res)=>{
  res.status(200).render('index');
});

router.get('/confirmation', (req, res)=>{
  res.status(200).render('coco');
});

app.use(router);
app.listen(3000, () => console.log(`express is up and running on ${port}`));
