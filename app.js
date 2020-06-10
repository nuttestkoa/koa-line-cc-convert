const Koa = require('koa');
const logger = require('koa-logger');
const Router = require('koa-router');
const bodyParser = require('koa-body');

const app = new Koa();

app.use(bodyParser({
    formidable: {uploadDir: './uploads'},
    multipart: true,
    urlencoded: true
}))

app.use(logger());

app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit('error', err, ctx);
    }
  });

const router = new Router();
const port = process.env.PORT || 4000;

app.use(router.routes());
app.use(router.allowedMethods());

require('./routes/basic')({ router });

app.on('error', (err, ctx) => {
    console.log('server error', err, ctx)
});

require('./routes/webhooks')({ router });

const server = app.listen(port);
module.exports = server;
