const Koa = require('koa');
const Router = require('koa-router');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const router = new Router();
const port = process.env.PORT || 4000;
app.use(logger());
app.use(bodyParser());

app.on('error', (err, ctx) => {
    console.log('server error', err, ctx)
});

app.use(router.routes());
app.use(router.allowedMethods());

router
    .get('/', (ctx, next) => {
        console.log(ctx);
        ctx.body = ctx;
    })
    .post('/webhook', async (ctx, next) => {
        console.log(ctx.request.body.events)
        var reply_Token = ctx.request.body.events[0].replyToken;
        console.log('token = ' , ctx.request.body.events[0].replyToken);

        var rp_body = {
            replyToken: reply_Token,
            messages: [{
                    type: 'text',
                    text: 'Hello'
                },
                {
                    type: 'text',
                    text: 'How are you?'
                }]
        };

        var options = {
            method: 'POST',
            url: 'https://api.line.me/v2/bot/message/reply',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer {82d6w35tT/ZdYKVd8G6OCOEmY5M+b4SYMBSp0NWilZ1OjW9nQQm2yRBiUcAQiLZ2gF3QApm6caL7EHjynnQGQn+P0kb+T3Qknn7nR3iBCLsQOfMxuyoJOdOrL+ogVX8uvBKBVwTunPeuqdojX77lJgdB04t89/1O/w1cDnyilFU=}'
            },
            json: true,
            body: rp_body
        };
        var rp = require('request-promise');
        rp(options)
            .then(function (parsedBody){
                console.log('rq success');
            })
            .catch(function (err) {
                console.log('server error', err, ctx);
            });
    });

app.listen(port);
module.exports = { app }

// console.log('Listening to %s', port);

// const express = require('express')
// const bodyParser = require('body-parser')
// const request = require('request')
// const app = express()
// const port = process.env.PORT || 4000
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())
// app.post('/webhook', (req, res) => {
//     let reply_token = req.body.events[0].replyToken
//     reply(reply_token)
//     res.sendStatus(200)
// })
// app.listen(port)
// function reply(reply_token) {
//     let headers = {
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer {82d6w35tT/ZdYKVd8G6OCOEmY5M+b4SYMBSp0NWilZ1OjW9nQQm2yRBiUcAQiLZ2gF3QApm6caL7EHjynnQGQn+P0kb+T3Qknn7nR3iBCLsQOfMxuyoJOdOrL+ogVX8uvBKBVwTunPeuqdojX77lJgdB04t89/1O/w1cDnyilFU=}'
//     }
//     let body = JSON.stringify({
//         replyToken: reply_token,
//         messages: [{
//             type: 'text',
//             text: 'Hello'
//         },
//         {
//             type: 'text',
//             text: 'How are you?'
//         }]
//     })
//     request.post({
//         url: 'https://api.line.me/v2/bot/message/reply',
//         headers: headers,
//         body: body
//     }, (err, res, body) => {
//         console.log('status = ' + res.statusCode);
//     });
// }

// router.get('/', (ctx, next) => {
//     console.log(ctx);
//     ctx.body = ctx;
// });

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