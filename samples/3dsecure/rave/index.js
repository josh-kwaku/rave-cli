const router = require('express').Router();
var Ravepay = require("ravepay"); // require rave nodejs sdk
const logger = require('heroku-logger');
var rave = new Ravepay(process.env.RAVE_PUBLIC_KEY, process.env.RAVE_SECRET_KEY, false); // get public and secret keys from environment variables stored in the .env file.

// We are going to be using pusher to get notified of when the 3dsecure page has redirected back to our backend and then we can notify the frontend and then close the opened window
var Pusher = require('pusher'); 
var pusher = new Pusher({
    appId: process.env.PUSHER_APPID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: 'eu',
    useTLS: true
  });

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
    "redirect_url": "http://localhost:80/rave/redirect", // set redirect url to the /redirect sub-route of our rave route
    "device_fingerprint": "69e6b7f0b72037aa8428b70fbe03986c",
}


router.get('/', (req, res) => {
    console.log("Here's the rave route");
    res.json({message: "Here's the rave route"});
});


// sample webhook implementation
router.post('/webhook', (req, res) => {
    // get verification hash as set in your rave dashboard
    var hash = req.headers['verif-hash'];

    // check if hash is valid
    if(!hash) {
        logger.info(`No hash sent in webhook request`); // most likely not from rave
        return; // discard request. Only a post with rave signature header gets our attention 
    }

    const secretHash = process.env.SECRET_HASH;

    // check if the hash sent is the same as the one set on your server
    if(hash !== secretHash){
        logger.info(`Wrong hash hash: ${hash} secretHash: ${secretHash}`);
        return // silently exit
    }

    // If the above conditions pass, everything is fine and we proceed to handle the response sent
    logger.info("WEBHOOK")
    logger.info(util.inspect(req.body));
    // Give value to your customer but don't give any output
    // Remember that this is a call from rave's servers and 
    // Your customer is not seeing the response here at all

    // use pusher to send response to frontend
    pusher.trigger('3dsecure-channel', 'webhook-response', {
        "message": req.body
    });
    res.json(200);
});


// sample redirect url implementation
router.get('/redirect', (req,res) => {
    logger.info("Welcome to the redirect route")
    let response = req.query.response; // get query response appended to url
    response = JSON.parse(response);

    if(response.status && response.status == "failed") {
        // send error response via socket
        pusher.trigger('3dsecure-channel', 'error', {
            "message": response.status + ". "+response.vbvrespmessage + ". Here's the card token though: "+ response.chargeToken.embed_token
        });
          
    }else {
        response.chargeToken.embed_token
        // send success response and embed token (i.e the card token)
        pusher.trigger('3dsecure-channel', 'success', {
            "message": response.status,
            "token": response.chargeToken.embed_token
        });
          
    }
    res.json({message: "Hang on. You will be redirected back to the payment page shortly"});
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
            var body = response.body;
            if(body.data.authurl != 'N/A' && body.status != "error") {
                console.log("got here")
                 // if no error occured and an authurl is returned as part of the response, it means the auth model for the card is 3Dsecure
                var response = {body: {g: response,status:"success", paymentType:"3DSecure", authurl: body.data.authurl, txref: body.data.txref, flwRef: body.data.flwRef}}
                res.json(response)
            }else res.json(response) // if not. auth model is OTP
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
