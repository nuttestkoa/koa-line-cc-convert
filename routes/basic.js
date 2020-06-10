module.exports = ({ router }) => {
    router.get('/', (ctx, next) => {
        let usd_to_thb = 31.0;
        let jpy_to_thb = 0.28;
        let receive_Text = "10 usd";
        lower_receive_Text = receive_Text.toLowerCase();
        console.log("log ctx")

        if (hasNumbers(receive_Text)) { 
            console.log('has numbers');
        }

        if (lower_receive_Text.includes('usd')) {
            console.log('has usd');
        }

        if (lower_receive_Text.includes('jpy')) {
            console.log('has jpy');
        }


        if ( hasNumbers(receive_Text)  ) {
            convert_number = receive_Text.match(/\d+/)[0];
            if (lower_receive_Text.includes('usd')) {
                let converted_usd = convert_number*usd_to_thb
                reply_Text = [{
                    type: 'text',
                    text: convert_number + ' USD is ' + converted_usd + ' THB'
                }]
            }
            if (lower_receive_Text.includes('jpy')) {
                let converted_jpy = convert_number*jpy_to_thb
                reply_Text = [{
                    type: 'text',
                    text: convert_number + ' JPY is ' + converted_jpy + ' THB'
                }]
            }
        } else {
            console.log("not match");
        }
    })
};

function hasNumbers(t)
{
    var regex = /\d/g;
    return regex.test(t);
}   