const router = require('express').Router();
var Ravepay = require("ravepay"); // require rave nodejs sdk
const logger = require('heroku-logger');
var rave = new Ravepay(process.env.RAVE_PUBLIC_KEY, process.env.RAVE_SECRET_KEY, false); // get public and secret keys from environment variables stored in the .env file.
const util = require('util');

var singleTransferObject = {
    "narration": "New transfer",
    "currency": "NGN",
    "reference": Date.now() + "-" + new Date().getUTCSeconds() // unique reference
}

var bulkTransferObject = {
    "title":"May Staff Salary",
  "bulk_data":[
  	{
        "account_bank":"",
        "account_number": "",
        "amount": 0,
        "currency":"NGN",
        "narration":"Your salary",
        "reference": Date.now() + "-" + new Date().getUTCSeconds() // unique reference
    },
    {
        "account_bank":"",
        "account_number": "",
        "amount": 0,
        "currency":"NGN",
        "narration":"Your salary",
        "reference": Date.now() + "-" + new Date().getUTCSeconds() // unique reference
    }
  ]
}
router.get('/', (req, res) => {
    console.log("Here's the rave route");
    res.json({message: "Here's the rave route"});
});

router.post('/initiatesingletransfer', (req, res) => {

    var { accountnumber, accountname, amount, accountbank } = req.body;
    singleTransferObject.account_number = accountnumber;
    singleTransferObject.amount = amount;
    singleTransferObject.account_bank = accountbank;

    rave.Transfer.initiate(singleTransferObject).then(response => {
        logger.info(util.inspect(response));
        res.json(response)
    }).catch(error => {
        logger.error(error);
        res.json(error);
    });
});

router.post('/initiatebulktransfer', (req, res) => {
    let { accountbank_1, accountnumber_1, amount_1, accountbank_2, accountnumber_2, amount_2 } = req.body;

    // update payload
    bulkTransferObject.bulk_data[0].account_bank = accountbank_1; 
    bulkTransferObject.bulk_data[0].amount = amount_1; 
    bulkTransferObject.bulk_data[0].account_number = accountnumber_1;

    bulkTransferObject.bulk_data[1].account_bank = accountbank_2; 
    bulkTransferObject.bulk_data[1].amount = amount_2; 
    bulkTransferObject.bulk_data[1].account_number = accountnumber_2; 

    rave.Transfer.bulk(bulkTransferObject).then(response => {
        logger.info(util.inspect(response));
        res.json(response)
    }).catch(error => {
        logger.error(error);
        res.json(error);
    });
})

module.exports = router;
