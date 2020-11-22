require('dotenv').config();

const express = require('express');
const routes = require('./src/routes');
const Mongo = require('../mongo/index');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3004;

Mongo.connect(process.env.MONGO);

app.use(cors());
app.use(bodyParser.json());
app.use('/api/1', routes);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
