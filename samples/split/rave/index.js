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
    "redirect_url": "https://www.scango.io/php/users/rave_return.php",
    "device_fingerprint": "69e6b7f0b72037aa8428b70fbe03986c",
    "subaccounts": [ 
        {
          "id": "RS_BF94DDF6AA2AB40BE874EA32DBD4DAA1",
          "transaction_charge":"1500",
          "transaction_charge_type":"flat_subaccount"
        },
        {
            "id": "RS_58DC71019A8AD190E30BDA93DB719FFC",
            "transaction_charge":"1500",
            "transaction_charge_type":"flat_subaccount"
        }
      ],
}

var accountPaymentObject = {
    "currency": "NGN",
    "payment_type": "account",
    "country": "NG",
    "email": "desola.ade1@gmail.com",
    "bvn": "12345678901",
    "phonenumber": "0902620185",
    "firstname": "",
    "lastname": "",
    "IP": "355426087298442",
    "txRef": "MC-"+ Date.now(), // merchant unique reference
    "device_fingerprint": "69e6b7f0b72037aa8428b70fbe03986c",
    "subaccounts": [ 
        {
          "id": "RS_BF94DDF6AA2AB40BE874EA32DBD4DAA1",
          "transaction_charge":"1500",
          "transaction_charge_type":"flat_subaccount"
        },
        {
            "id": "RS_58DC71019A8AD190E30BDA93DB719FFC",
            "transaction_charge":"1500",
            "transaction_charge_type":"flat_subaccount"
        }
      ],
}

router.get('/', (req, res) => {
    console.log("Here's the rave route");
    res.json({message: "Here's the rave route"});
});

router.post('/chargeaccount', (req, res) => {
    var { accountnumber, accountname, amount, accountbank } = req.body;

    // update payload with necessary details
    accountPaymentObject.accountnumber = accountnumber
    accountPaymentObject.firstname = accountname.split(" ")[0]
    accountPaymentObject.lastname = accountname.split(" ")[1]
    accountPaymentObject.amount = amount
    accountPaymentObject.accountbank = accountbank
    // console.log(util.inspect(accountPaymentObject));
    rave.Account.charge(accountPaymentObject)
        .then(response => {
            logger.info(util.inspect(response));
            res.json(response)
        }).catch(error => {
            logger.error(error);
            res.json(error);
        })
})


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

router.post('/completecharge', (req,res) => {
    var { transaction_reference, transactionreference, otp } = req.body;

    if(transaction_reference) {

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
    }else if(transactionreference) {

        // perform account charge validation
        rave.Account.validate({
            transactionreference,
            otp
        }).then((response) => {
            console.log(response)
            res.json(response)
        }).catch(error => {
            console.log(error)
            res.json(error)
        })
    }else res.json();
})



module.exports = router;
