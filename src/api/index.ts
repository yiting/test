import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import AppRoutes from './routes';

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

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000);

console.log('Koa application is up and running on port 3000');
