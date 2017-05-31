const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const port = process.env.PORT|| 3000;
const compileTemplate = require('./compileTemplate');
const nodemailer = require('bluebird').promisifyAll(require('nodemailer'));

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_ADDRESS,
    auth: process.env.GMAIL_PASSWORD
  }
});

const app = express();

app.use(morgan());
app.use(bodyParser.urlendcoded({ extended: true }));

app.post('/generate-email', (req, res) => {
  console.log(req);
  const mailOptions = {
    from: req.body.email,
    to: req.body.companyEmail,
    subject: req.body.subject,
    text: compileTemplate(req.body)
  };

  transport
    .sendMailSync(mailOptions)
    .then((info) => {
      console.log(info);
      res.redirect('/');
    })
    .catch(err => res.status(500).send(err));
});

app.set('views', __dirname +'/index');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/views'));


app.get('/', (req,res)=>{
  res.status(200).render('index');
});

app.listen(3000, () => console.log(`express is up and running on ${port}`));
