const Rave = require('ravepay');
const rave = new Rave('FLWPUBK-ba0a57153f497c03bf34a9e296aa9439-X','FLWSECK-327b3874ca8e75640a1198a1b75c0b0b-X', false);
const util = require('util')

/**
 * This code snippet below shows how to charge a card (mastercard)
 * Please see below on how to handle VISA cards.
 */
rave.Account.charge(
    {
        "accountbank": "101",// get the bank code from the bank list endpoint.
        "accountnumber": "5900102340",
        "currency": "NGN",
        "payment_type": "account",
        "country": "NG",
        "amount": "100",
        "email": "desola.ade1@gmail.com",
        "bvn": "12345678901",
        "phonenumber": "0902620185",
        "firstname": "temi",
        "lastname": "desola",
        "IP": "355426087298442",
        "txRef": "MC-0292920", // merchant unique reference
        "device_fingerprint": "69e6b7f0b72037aa8428b70fbe03986c"
      }
).then(resp => {
    console.log(resp.body);
    // rave.Account.validate({
    //     "transaction_reference": resp.body.data.flwRef,
    //     "otp":12345
    // }).then(response => {
    //     console.log(util.inspect(response.body));
    //     return response.body.data.tx;
    // })
}).catch(err => {
    console.log(err);
});

