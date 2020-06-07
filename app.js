const express = require('express')
const app = express()
const port = process.env.PORT || 4000
app.post('/webhook', (req, res) => res.sendStatus(200))
app.listen(port)


// const Koa = require('koa');
// const Router = require('koa-router');
// const logger = require('koa-logger');
// const app = new Koa();
// const router = new Router();
// app.use(logger());
// router.get('/', (ctx, next) => {
//     console.log(ctx);
//     ctx.body = ctx;
// });
// app.use(router.routes());
// app.use(router.allowedMethods());
// app.use(async (ctx, next) => {
//     try {
//         await next();
//     } catch (err) {
//         ctx.status = err.status || 500;
//         ctx.body = err.message;
//         ctx.app.emit('error', err, ctx);
//     }
// });
// const server = app.listen(3000);
// module.exports = server;