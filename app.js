const Koa = require('koa');
const Router = require('koa-router');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const router = new Router();
const port = process.env.PORT || 4000;

var usd_rates = 0.0;
var thb_rates = 0.0;
var usb_to_thb = 0.0;

app.use(logger());
app.use(bodyParser());

app.on('error', (err, ctx) => {
    console.log('server error', err, ctx)
});

app.use(router.routes());
app.use(router.allowedMethods());


router
    .get('/', (ctx, next) => {
        console.log('Test FIXER API');
        ctx.body = ctx;
        // var fx_option = {
        //     method: 'GET',
        //     url: 'http://data.fixer.io/api/latest?access_key=6646d19dc18a481c1fc14f93094a3197',
        //     json: true
        // }
        // var fx_rp = require('request-promise');
        // fx_rp(fx_option)
        //     .then(function (parsedBody){
        //         console.log('fx rq success');
        //         console.log(ctx);
        //     })
        //     .catch(function (err) {
        //         console.log('server error', err, ctx);
        //     });
    })
    // .get('/fixer', async (ctx, next) => {
    //     console.log('FIXER API START');
    //     ctx.body = ctx;
    //     // console.log(ctx.request.body);
    //     // http://data.fixer.io/api/latest?access_key=6646d19dc18a481c1fc14f93094a3197
        
        
    // })
    .post('/webhook', async (ctx, next) => {
        var fx_option = {
            method: 'GET',
            url: 'http://data.fixer.io/api/latest?access_key=6646d19dc18a481c1fc14f93094a3197',
            json: true
        }
        var fx_rp = require('request-promise');
        fx_rp(fx_option)
            .then(function (parsedBody){
                console.log('fx rq success');
                // console.log('parsed = ' , parsedBody);
                console.log('USD = ' , parsedBody.rates.USD);
                usd_rates = parsedBody.rates.USD;
                console.log('THB = ' , parsedBody.rates.THB);
                thb_rates = parsedBody.rates.THB;
                usb_to_thb = (1 / usd_rates) * thb_rates;
            })
            .catch(function (err) {
                console.log('server error', err, ctx);
            });


        var reply_Token = ctx.request.body.events[0].replyToken;
        var receive_Text = ctx.request.body.events[0].message.text;
        if(reply_Token === '00000000000000000000000000000000') {
            ctx.status = 200;
        } else {
        var rp_body = {
            replyToken: reply_Token,
            messages: [{
                    type: 'text',
                    text: 'Hello'
                },
                {
                    type: 'text',
                    text: 'USD rates : ' + usb_to_thb.toFixed(2)
                },
                {
                    type: 'text',
                    text: 'I will echo your text :'
                },
                {
                    type: 'text',
                    text: receive_Text
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
        }
    });

app.listen(port);
module.exports = { app }
