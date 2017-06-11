const express = require('express');
const router = require('./config/routes');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const port = process.env.PORT|| 3000;
const expressLayouts = require('express-ejs-layouts');
const pub =  __dirname;


const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', pub + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static(`${__dirname}/public`));



app.use(router);
app.listen(port, () => console.log(`express is up and running on ${port}`));

module.exports = app;
