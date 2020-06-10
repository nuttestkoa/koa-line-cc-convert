module.exports = ({ router }) => {
        
    var usd_rates = 0.0;
    var thb_rates = 0.0;
    var jpy_rates = 0.0;

    var usd_to_thb = 0.0;
    var jpy_to_thb = 0.0;

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
                //console.log('parsed = ' , parsedBody);
                //console.log('USD = ' , parsedBody.rates.USD);
                usd_rates = parsedBody.rates.USD;
                //console.log('THB = ' , parsedBody.rates.THB);
                thb_rates = parsedBody.rates.THB;

                jpy_rates = parsedBody.rates.JPY;
                usd_to_thb = (1 / usd_rates) * thb_rates;
                jpy_to_thb = (1 / jpy_rates) * thb_rates;
            })
            .catch(function (err) {
                console.log('server error', err, ctx);
            });

        try {
            let reply_Token = ctx.request.body.events[0].replyToken;
        
            if(reply_Token === '00000000000000000000000000000000') {
                ctx.status = 200;
            } else {

                let reply_Type = ctx.request.body.events[0].type;
                console.log( 'Body = ' , ctx.request.body);

                let reply_Text = [];

                if( reply_Type === 'message') {
                    
                    let receive_Text = ctx.request.body.events[0].message.text;
                    let lower_receive_Text = receive_Text.toLowerCase();
                    let echo_Text = ["echo", "Echo", "ECHO"];
                    
                    if( lower_receive_Text.includes('echo')) {
                        reply_Text = [{
                            type: 'text',
                            text: 'Hello, I will echo your text :'
                        },
                        {
                            type: 'text',
                            text: receive_Text
                        }]
                    } else if ( hasNumbers(receive_Text) ) {
                        convert_number = receive_Text.match(/\d+/)[0];
                        if (lower_receive_Text.includes('usd')) {
                            let converted_usd = convert_number*usd_to_thb
                            reply_Text = [{
                                type: 'text',
                                text: convert_number + ' USD is ' + converted_usd + ' THB'
                            }]
                        } else if (lower_receive_Text.includes('jpy')) {
                            let converted_jpy = convert_number*jpy_to_thb
                            reply_Text = [{
                                type: 'text',
                                text: convert_number + ' JPY is ' + converted_jpy + ' THB'
                            }]
                        } else {
                            reply_Text = [{
                                type: 'text',
                                text: 'Welcome to currency converter by Nut'
                            }]
                        }
                    }

                } else {

                    reply_Text = [{
                        type: 'text',
                        text: 'Sorry, I can understand only text for now'
                    }]

                }

                let rp_body = {
                    replyToken: reply_Token,
                    messages: reply_Text
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
        } catch(err) {
            ctx.body = err.message;
            ctx.status = err.status || 500;
            ctx.app.emit('error', err, ctx);
        }
    })
};

function hasNumbers(t)
{
    var regex = /\d/g;
    return regex.test(t);
}   