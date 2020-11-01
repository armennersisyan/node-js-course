require('dotenv').config();

const cors = require('@koa/cors');
const Koa = require('koa');
const app = new Koa();

const routes = require('./src/routes/index');

const bodyParser = require('koa-body');
const koaJSON = require('koa-json');

//Set up body parsing middleware
app.use(cors());
app.use(koaJSON());
app.use(bodyParser({ urlencoded: true }));

app
    .use(routes.routes())
    .use(routes.allowedMethods());

app.listen(process.env.PORT || 3001)
