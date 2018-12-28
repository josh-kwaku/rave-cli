var cardPay = document.getElementById('card-pay');
var tokenPay = document.getElementById('token-pay');
var cardForm = document.getElementById("card-form");
var tokenForm = document.getElementById("token-form");
var wrapper = document.getElementById("wrapper");

var server_url = 'http://localhost:80/'; // the nodejs server url


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
                            // the card token is accessed here: response.data.tx.chargeToken.embed_token
                            showSuccessMessage(response.data.data.responsemessage+"<br/>AuthModel: "+response.data.tx.authModelUsed+"<br/>Card Token: "+response.data.tx.chargeToken.embed_token, cardPay);
                        }else if (response.data.data.responsecode == 'RR') { // the charge failed for the reason contained in // response.data.data.responsemessage
                            hideSpinner();
                            showErrorMessage(response.data.data.responsemessage, cardPay)
                        }else{  // the charge failed for the reason contained in // response.message
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

tokenPay.addEventListener('click', function(e) {
    e.preventDefault();

    hideMessages();
    showSpinner(wrapper);

    var tokenData = extractFormValues(tokenForm); // collect token from form. See the extractFormValues function below.
    
    makeRequest('rave/chargetokenizedcard', tokenData, false)
        .then(function _(response) {
            if(response.status == "success"){
                showSuccessMessage("Tokenized card charge was successful", tokenPay);
                hideSpinner()
            }
            else { // tokenized card charge failed for reason contained in response.data.message || response.message
                showErrorMessage(response.data.code + ": "+response.data.message || response.message, tokenPay);
                hideSpinner()
            }
        }).catch(function _(error) {
            showErrorMessage(JSON.stringify(error),tokenPay);
            hideSpinner();
        })

});

/**
 * Populates an object with values from the input contained in a form. Using the input name as the object keys
 * @param {*} form html form containing input fields
 */
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