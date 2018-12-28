const router = require('express').Router();
var Ravepay = require("ravepay"); // require rave nodejs sdk
const logger = require('heroku-logger');
var rave = new Ravepay(process.env.RAVE_PUBLIC_KEY, process.env.RAVE_SECRET_KEY, false); // get public and secret keys from environment variables stored in the .env file.
const util = require('util');

var cardPaymentObject = {
    "currency": "NGN",
    "country": "NG",
    "amount": "10",
    "suggested_auth": "pin",
    "email": "kwakujosh@gmail.com",
    "phonenumber": "09093146022",
    "firstname": "Joshua",
    "lastname": "Boateng",
    "IP": "355426087298442",
    "txRef": "MC-" + Date.now(),// your unique merchant reference
    "meta": [{metaname: "flightID", metavalue: "123949494DC"}],
    "redirect_url": "https://your-redirect-url.com/redirect",
    "device_fingerprint": "69e6b7f0b72037aa8428b70fbe03986c",
}


router.get('/', (req, res) => {
    console.log("Here's the rave route");
    res.json({message: "Here's the rave route"});
});


router.post('/initiatecharge', (req, res) => {
    var { cardno, expdate, cvv, pin } = req.body;

    // update payload
    cardPaymentObject.cardno = cardno;
    cardPaymentObject.cvv = cvv;
    cardPaymentObject.pin = pin;
    cardPaymentObject.expirymonth = expdate.split('/')[0];
    cardPaymentObject.expiryyear = expdate.split('/')[1];

    logger.info(JSON.stringify(cardPaymentObject));
    rave.Card.charge(cardPaymentObject)
        .then((response) => {
            logger.info(JSON.stringify(response));
            res.json(response)
        })
        .catch((error) => {
            logger.error(error)
            res.json(error)
        })
});

router.post('/chargetokenizedcard', (req, res) =>  {
    var { token } = req.body;
    cardPaymentObject.token = token;
    logger.info(cardPaymentObject);
    rave.TokenCharge.card(cardPaymentObject)
        .then((response) => {
            // console.log(response)
            res.json(response)
        }).catch(error => {
            // console.log(error)
            res.json(error)
        })
});

router.post('/completecharge', (req,res) => {
    var { transaction_reference, transactionreference, otp } = req.body;

    // perform card charge validation
    rave.Card.validate({
        transaction_reference,
        otp
    }).then((response) => {
        console.log(response)
        res.json(response)
    }).catch(error => {
        console.log(error)
        res.json(error)
    })
    
})



module.exports = router;
