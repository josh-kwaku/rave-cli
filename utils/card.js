const Rave = require('ravepay');
const rave = new Rave('FLWPUBK-ba0a57153f497c03bf34a9e296aa9439-X','FLWSECK-327b3874ca8e75640a1198a1b75c0b0b-X', false);
const util = require('util'); 
const errorHandler = require('./error');

module.exports = (args) => {
    switch (args.type) {
        case 'mastercard':
            break;
        
        case 'visa':
            break;
    
        default:
            errorHandler(`You need to specify a card type like so:\n rave run webhook --card mastercard`, true)
            break;
    }
}

/**
 * This code snippet below shows how to charge a card (mastercard)
 * Please see below on how to handle VISA cards.
 */
rave.Card.charge(
    {
        "cardno": "5399838383838381",
        "cvv": "470",
        "expirymonth": "10",
        "expiryyear": "22",
        "currency": "NGN",
        "country": "NG",
        "amount": "100",
        "pin": "3310",
        "suggested_auth": "PIN",
        "email": "user@gmail.com",
        "phonenumber": "0902620185",
        "firstname": "Jake",
        "lastname": "Parkers",
        "IP": "355426087298442",
        "txRef": "MC-" + Date.now(),// your unique merchant reference
        "meta": [{metaname: "flightID", metavalue: "123949494DC"}],
        "redirect_url": "https://guarded-lake-45444.herokuapp.com/rave/test",
        "device_fingerprint": "69e6b7f0b72037aa8428b70fbe03986c"
      }
).then(resp => {
    rave.Card.validate({
        "transaction_reference": resp.body.data.flwRef,
        "otp":12345
    }).then(response => {
        console.log(util.inspect(response.body));
        return response.body.data.tx;
    })
}).catch(err => {
    console.log(err);
});

