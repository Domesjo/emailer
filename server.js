const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT|| 3000;

const app = express();



app.listen(3000, ()=> console.log(`express is up and running on ${port}`));
