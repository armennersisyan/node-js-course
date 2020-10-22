require('dotenv').config();

const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./src/server/routes/index');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use('/api/1', routes);

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running...')
})
