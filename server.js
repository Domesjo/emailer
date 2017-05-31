const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const port = process.env.PORT|| 3000;

const app = express();

app.use(morgan());
app.use(bodyParser());


app.listen(3000, () => console.log(`express is up and running on ${port}`));
