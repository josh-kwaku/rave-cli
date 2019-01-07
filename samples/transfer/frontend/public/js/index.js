var cardPay = document.getElementById('card-pay');
var accountPay = document.getElementById('account-pay');
var accountPay2 = document.getElementById('account-pay_2');
var cardForm = document.getElementById("card-form");
var accountForm = document.getElementById("account-form");
var accountForm2 = document.getElementById("account-form_2");
var accountNameField = document.getElementById("accountname");
var wrapper = document.getElementById("wrapper");

var server_url = 'http://localhost:80/'; // the nodejs server url

var account_resolve_url = 'https://ravesandbox.azurewebsites.net/flwv3-pug/getpaidx/api/resolve_account'; // Rave's account resolver url for sandbox environment (i.e this url resolves only test cards);

var accountResolveData = {
    PBFPubKey: "FLWPUBK-ba0a57153f497c03bf34a9e296aa9439-X", // your public key
    recipientaccount: "",
    destbankcode: 0,
}

accountPay.addEventListener('click', function(e) {
    e.preventDefault();

    hideMessages();
    showSpinner(wrapper);
    var accountData = extractFormValues(accountForm);
    accountResolveData.recipientaccount = accountData.accountnumber; // set recipient account of the resolve payload
    accountResolveData.destbankcode = accountData.accountbank; // set bank code of the resolve payload

    // first we try to resolve the account number entered to confirm if it's a valid one and also to get the name of the account
    makeRequest(account_resolve_url,accountResolveData,true)
        .then(response => {
            hideSpinner();
            if(response.data) {
                accountNameField.value = response.data.data.accountname; // update account name field

                // update the accountData payload to include the amount, account name and account bank
                accountData.accountbank =  accountData.accountbank;
                accountData.amount =  accountData.amount;
                accountData.accountname = accountNameField.value;
                makeRequest('rave/initiatesingletransfer', accountData, false)
                    .then(response => {
                        if(response.status == "error") {
                            console.log("Error: ", response);
                            showErrorMessage(response.message, accountPay);
                            hideSpinner();
                        }else {
                            console.log(response);
                            response = response.data;
                            if(response.status == "FAILED") { // check for the status of the transfer
                                showErrorMessage(response.complete_message + ". Seems like the account number you entered doesn't match the bank you chose. Try again", accountPay);
                                hideSpinner();
                            }else {
                                hideSpinner();
                                showSuccessMessage("Transfer of "+ response.amount +" to " + response.fullname + " was successful", accountPay);
                                hideSpinner();
                            }
                        }
                    }).catch(error => {
                        showErrorMessage(error, accountPay);
                        hideSpinner();
                    })

                // make the api request to charge the account
            }

            else showErrorMessage("Could not resolve account with account number "+ accountData.accountnumber +". Ensure the account number is valid", accountPay);
        }).catch(error => {
            showErrorMessage("Oops!!! An error occurred error", accountPay);
        })

});

accountPay2.addEventListener('click', function(e) {
    e.preventDefault();

    hideMessages();
    showSpinner(wrapper);
    var accountData = extractFormValues(accountForm2);
    console.log(accountData);
    makeRequest('rave/initiatebulktransfer', accountData, false)
        .then(response => {
            if(response.status == "error") {
                console.log("Error: ", response);
                showErrorMessage(response.message, accountPay2);
                hideSpinner();
            }else {
                hideSpinner();
                showSuccessMessage(response.message, accountPay2);
                hideSpinner();
            }
        }).catch(error => {
            showErrorMessage(error, accountPay);
            hideSpinner();
        });

});

function extractFormValues(form) {
    var input_object = {}
    for (let index = 0; index < form.length - 1; index++) {
        var element = form[index];
        input_object[element.id] = element.value;
    }
    return input_object
}

// call fetch api
function makeRequest(endpoint, data, external=false) {
    var url = external ? endpoint : server_url + endpoint;
    var options = {
        method: "POST", 
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        redirect: "follow", 
        referrer: "no-referrer", 
        body: JSON.stringify(data)
    }
    return new Promise(function _(resolve, reject) {
        fetch(url, options).then(function _(response) {
            console.log(response)
            return response.json()
        }).then(function _ (data) {
            console.log(data)
            if(data.body == undefined) resolve(data)
            resolve(data.body)
        }).catch(function _ (error) {
            reject(error)
        }).catch(function _ (error) {
            reject(error)
        })
    });
}

function showSuccessMessage(message, element) {
    var div = document.createElement("div");
    div.setAttribute('class','success');
    div.setAttribute('id','message');
    div.style.display = 'block';
    div.innerHTML = '<i class="fas fa-check-circle"></i>  ' +message
    div.appendAfter(element)
}

function showErrorMessage(message, element) {
    var div = document.createElement("div");
    div.style.display = 'block';
    div.setAttribute('class','error')
    div.setAttribute('id','message')
    div.innerHTML = '<i class="fas fa-times-circle"></i>  ' +message
    div.appendAfter(element)
}

function showSpinner(element) {
    var div = document.createElement("div");
    div.style.display = "block"
    div.setAttribute('class', 'spinner')
    div.setAttribute('id', 'spinner');
    div.appendBefore(element);
}

function hideMessages() {
    if(document.getElementById("message"))
        document.getElementById("message").style.display = "none"
}

function hideSpinner() {
    if(document.getElementById("spinner"))
        document.getElementById("spinner").style.display = "none"
}

Element.prototype.appendBefore = function (element) {
    element.parentNode.insertBefore(this, element);
},false;

Element.prototype.appendAfter = function (element) {
    element.parentNode.insertBefore(this, element.nextSibling);
},false;