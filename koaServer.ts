import * as Koa from 'koa';
import * as Router from 'koa-router';

const app = new Koa();


const router1 = new Router();

router1.post('/', (ctx, next) => {
  ctx.body = 'post';
});

router1.get('/', (ctx, next) => {
  ctx.body = 'get';
});

router1.head('/', (ctx, next) => {
  ctx.body = 'head';
});

router1.options('/', (ctx, next) => {
  ctx.body = 'options';
});

router1.put('/', (ctx, next) => {
  ctx.body = 'put';
});

router1.patch('/', (ctx, next) => {
  ctx.body = 'patch';
});

router1.del('/', (ctx, next) => {
  ctx.body = 'del';
});


router1.get('/ping', (ctx, next) => {
  console.log('headers: ', ctx.headers);
  ctx.body = 'hello world';
});

router1.get('/hello/he', (ctx, next) => {
  ctx.body = 'hello/he world';
});

const router = new Router();

router.use(router1.routes());
app.use(router.routes());

app.use((ctx, next) => {
  ctx.body = ctx.path;
});

app.listen(7001, () => {
  console.log('app listen on 7001');
  console.log('process.env: ', process.env);
});
