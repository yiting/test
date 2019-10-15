import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import AppRoutes from './routes';
var cors = require('koa2-cors');

// create koa app
const app = new Koa();
// const router = new Router<any>();
const router: any = new Router();
// register all application routes

AppRoutes.forEach((route: any) => {
  router[route.method](route.path, route.action);
});

// run app
// app.use(bodyParser());
app.use(
  bodyParser({
    formLimit: '300mb',
    jsonLimit: '300mb',
    textLimit: '300mb',
    // enableTypes: ['json', 'form', 'text']
  }),
);
app.use(cors());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(8082);

console.log('Koa application is up and running on port 8082');
