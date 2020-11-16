require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const routes = require('./src/routes');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3004;

mongoose.connect(process.env.MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

app.use(cors());
app.use(bodyParser.json());
app.use('/api/1', routes);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
