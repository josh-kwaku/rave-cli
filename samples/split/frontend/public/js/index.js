var cardPay = document.getElementById('card-pay');
var accountPay = document.getElementById('account-pay');
var cardForm = document.getElementById("card-form");
var accountForm = document.getElementById("account-form");
var accountNameField = document.getElementById("accountname");
var wrapper = document.getElementById("wrapper");

var server_url = 'http://localhost:80/'; // the nodejs server url

var account_resolve_url = 'https://ravesandbox.azurewebsites.net/flwv3-pug/getpaidx/api/resolve_account'; // Rave's account resolver url for sandbox environment (i.e this url resolves only test cards);
var access_bank_code = '044';

var accountResolveData = {
    PBFPubKey: "FLWPUBK-ba0a57153f497c03bf34a9e296aa9439-X", // your public key
    recipientaccount: "",
    destbankcode: access_bank_code,
}

cardPay.addEventListener('click', function(e) {
    e.preventDefault();
    hideMessages();
    showSpinner(wrapper);
    // call api
    var formData = extractFormValues(cardForm);
    makeRequest('rave/initiatecharge',formData)
        .then(response => {
            if(response.status == "error") {
                hideSpinner();
                showErrorMessage(response.message, cardPay);
            }
            if(response.data.chargeResponseCode == 02){ // a chargeResponseCode of 02 depicts that the transaction needs OTP validation to continue
                otp = prompt(response.data.chargeResponseMessage);
                transaction_reference = response.data.flwRef;
                makeRequest('rave/completecharge', {otp, transaction_reference})
                    .then(function _(response) {
                        if(response.data.data.responsecode == 00) {
                            hideSpinner();
                            showSuccessMessage(response.data.data.responsemessage+"<br/>AuthModel: "+response.data.tx.authModelUsed, cardPay);
                        }else if (response.data.data.responsecode == 'RR') {  // the charge failed for the reason contained in // response.data.data.responsemessage
                            hideSpinner();
                            showErrorMessage(response.data.data.responsemessage, cardPay)
                        }else{ 
                            // the charge failed for the reason contained in //
                            hideSpinner();
                            showErrorMessage(response.message, cardPay)
                        }
                    }).catch(function _(error) {
                        hideSpinner();
                        showErrorMessage(error, cardPay)
                    })
            }
        }).catch(function _(error) {
            hideSpinner()
            showErrorMessage(error, cardPay)
        })
});

accountPay.addEventListener('click', function(e) {
    e.preventDefault();

    hideMessages();
    showSpinner(wrapper);
    var accountData = extractFormValues(accountForm);
    
    accountResolveData.recipientaccount = accountData.accountnumber; // set recipient account of the resolve payload

    // first we try to resolve the account number entered to confirm if it's a valid one and also to get the name of the account
    makeRequest(account_resolve_url,accountResolveData,true)
        .then(response => {
            hideSpinner();
            if(response.data) {
                accountNameField.value = response.data.data.accountname || 'Access Bank'; // update account name field

                // update the accountData payload to include the amount, account name and account bank
                accountData.accountbank =  access_bank_code;
                accountData.amount =  5000;
                accountData.accountname = accountNameField.value;
                makeRequest('rave/chargeaccount', accountData, false)
                    .then(response => {
                        if(response.status == "error") {
                            console.log("Error: ", response);
                            showErrorMessage(response.message, cardPay);
                            hideSpinner();
                        }
                        if(response.data.chargeResponseCode == 02){ // a chargeResponseCode of 02 depicts that the transaction needs OTP validation to continue
                            console.log(response)
                            otp = prompt(response.data.validateInstructions.instruction);
                            var transactionreference = response.data.flwRef;
                            makeRequest('rave/completecharge', {otp, transactionreference})
                                .then(function _(response) {
                                    console.log(response);
                                    if(response.data.acctvalrespcode == 00) {
                                        console.log(response);
                                        showSuccessMessage(response.data.acctvalrespmsg, accountPay);
                                        hideSpinner();
                                    }else if (response.data.data.responsecode == 'RR') {  // the charge failed for the reason contained in // response.data.data.responsemessage
                                        showErrorMessage(response.data.data.responsemessage, accountPay)
                                        hideSpinner();
                                    }else{ 
                                        // the charge failed for the reason contained in // response.message
                                        showErrorMessage(response.message, accountPay)
                                        hideSpinner();
                                    }
                                }).catch(function _(error) {
                                    showErrorMessage(error, accountPay);
                                    hideSpinner();
                                })
                        }
                        console.log(response);
                    }).catch(error => {
                        showErrorMessage(error, accountPay);
                        hideSpinner();
                    })

                // make the api request to charge the account
            }

            else showErrorMessage(`Could not resolve account with account number ${accountData.accountnumber}. Ensure the account number is valid`, accountPay);
        }).catch(error => {
            showErrorMessage(`Oops!!! An error occurred ${error}`, accountPay);
        })

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