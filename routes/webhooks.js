module.exports = ({ router }) => {
        
    var usd_rates = 0.0;
    var thb_rates = 0.0;
    var usb_to_thb = 0.0;

    router.post('/webhook', async (ctx, next) => {
        let fx_option = {
            method: 'GET',
            url: 'http://data.fixer.io/api/latest?access_key=6646d19dc18a481c1fc14f93094a3197',
            json: true
        }
        let fx_rp = require('request-promise');
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


        let reply_Token = ctx.request.body.events[0].replyToken;
        let receive_Text = ctx.request.body.events[0].message.text;
        if(reply_Token === '00000000000000000000000000000000') {
            ctx.status = 200;
        } else {
            let rp_body = {
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
            }

            let options = {
                method: 'POST',
                url: 'https://api.line.me/v2/bot/message/reply',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer {82d6w35tT/ZdYKVd8G6OCOEmY5M+b4SYMBSp0NWilZ1OjW9nQQm2yRBiUcAQiLZ2gF3QApm6caL7EHjynnQGQn+P0kb+T3Qknn7nR3iBCLsQOfMxuyoJOdOrL+ogVX8uvBKBVwTunPeuqdojX77lJgdB04t89/1O/w1cDnyilFU=}'
                },
                json: true,
                body: rp_body
            };
            let rp = require('request-promise');
            rp(options)
                .then(function (parsedBody){
                    console.log('line rq success');
                })
                .catch(function (err) {
                    console.log('server error', err, ctx);
                });
        }
    })
};