import * as Koa from 'koa';
import * as Router from 'koa-router';
import {WindowRateLimiter, IConfig} from 'koa-rate-limits';
import * as Redis from 'ioredis';

const app = new Koa();
const limiterConfig: IConfig = {
    default: {
        limit: 10,
        duration: 10,
    },
    _hello: {
        limit: 3,
        duration: 10,
    },
};
WindowRateLimiter.init(new Redis(), limiterConfig, 'prefix');

app.use(WindowRateLimiter.limiter);
const router1 = new Router();
router1.get('/hello', (ctx, next) => {
    ctx.body = 'hello world';
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
});
