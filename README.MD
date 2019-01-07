<!-- ![Rave](https://flutterwave.com/wp-content/themes/flutterwave/images/flutterthings.png) -->
# RAVE CLI
> The easiest way to make and accept payments from customers anywhere in the world.

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Downloads Stats][npm-downloads]][npm-url]

The Rave docs can be found [here](https://developer.flutterwave.com/docs). And the CLI docs can be found [here]()


# Getting Started
> If you are new to Rave, we highly recommend you read through the docs a little for a more general introduction.

## What is a sample App?

We've created sample templates that would show you in practice (code) how to carry out some payments using our Node SDK. These apps can be run and tested locally as described in the rest of the documentation.

We recommend that you go through the code of these templates to see how all of these payment types are implemented.

## How the Rave CLI works?

Rave cli generates the requested sample app in your preferred directory. Every sample has a node server that can be spun up and a frontend that sends request to the node server via http calls to test the sample app.

Every sample app has ```.env``` file which you're required to update with your ```Rave Sandbox``` public and secret keys and other keys as deemed necessary.

## CLI vs Rave

The CLI and Rave itself are different. The CLI is just a helper to get you started quicker using our ```Node.js``` sdk. And Rave is just Rave.

## Requirements

* All Rave CLI samples are run using Node.js ```8.12.0``` or higher. If you haven't yet installed Node.js, you can do so [here](https://nodejs.org).

* You obviously need to have a ```Rave Sandbox``` account. You can create one [here](https://rave.flutterwave.com/login?_ga=2.52042537.1235922808.1545914614-813837257.1545375560).

* To see the webhook sample in action, you will need to create a [Pusher Account](https://pusher.com/)

* Install live-server globally ```npm install -g live-server```


## Quick Setup Guide

First up is installing the CLI.

```
 # install the CLI globally
 npm install -g rave-cli
```
Your CLI should be up and running now. Next we create our first sample app!!

```
 # create a directory with the minimal files required
 rave create --app transfer

 # move into the newly created directory
 cd transfer

 # open the .env file and put in your Rave Sandbox public and secret keys or set your keys like so:
 rave set --SANDBOX_SECRET_KEY
 rave set --SANDBOX_PUBLIC_KEY

 # install all the libraries needed
 npm install

 # start the node server
 nodemon app.js

 # start the frontend server
 cd frontend/public && live-server --port=3000
```
You should now have a working local app. Read and follow the instructions on the left of the served up page.


# Available Sample Apps

* Transfer (transfer)

* Split Payments (split)

* 3D Secure (3dsecure)

* Tokenized Charge (tokenized)


# Creating a Sample App

> Here's a Tip: If this is your first time here, see the [Quick Start Above](#)

Creating an App can be done entirely locally and they are fairly simple Node.js apps using the standard Node environment and should be completely useable and understandable.

## Sample Apps folder structure

![Folder Structure](/samples_folder_structure.PNG)

## Creating a sample Transfer App

The sample transfer app shows you how to initiate single and bulk transfers with the help of our Node.js Sdk.

We have provided guides on the left of the served up HTML page for you to see transfers in action. We ```strongly recommend``` that you read up those instructions so as to be able to get the appropriate account details to use for the test; as well as other vital info.

All sucessful transfers will be queued in your Rave dashboard under transfers. Kindly check them out.

Creating the app:

```
 # make a folder
 mkdir rave-samples
 cd rave-samples

 # generate the transfer app
 rave create --app transfer

 # open the .env file and put in your ```Rave Sandbox``` public and secret keys or set your keys like so:
 rave set --SANDBOX_SECRET_KEY
 rave set --SANDBOX_PUBLIC_KEY

 # install all the libraries needed
 npm install

 # start the node server
 nodemon app.js

 # start the frontend server
 cd frontend/public && live-server --port=3000
```
Yay! You should have a sample transfer app all set up now. **A piece of advice: Check out the code to see how it was implemented.**

## Creating a sample 3dsecure App

The 3dsecure sample app shows you how to handle cards that are eligible for 3dsecure transactions. 

3dsecure transactions require redirects back to your payment page after a successful transaction. As such, the 3dsecure sample app also shows you how to handle redirects back to your page.

We have provided guides on the left of the served up HTML page for you to see 3dsecure transactions in action. We ```strongly recommend``` that you read up those instructions so as to be able to get the appropriate card details to use for the test; as well as other vital info.

*Before you proceed, ensure you've created a [Pusher Account](https://pusher.com/) as you will be needing your Pusher keys.*

Creating the app:

```
 # make a folder
 mkdir rave-samples
 cd rave-samples

 # generate the needed app
 rave create --app 3dsecure

 # open the .env file and put in your ```Rave Sandbox``` public and secret keys together with your ```Pusher keys```

 # install all the libraries needed
 npm install

 # start the node server
 nodemon app.js

 # start the frontend server
 cd frontend/public && live-server --port=3000
```
Yay! You should have a sample 3dsecure app all set up now. **A piece of advice: Check out the code to see how it was implemented.**


# IMPORTANT!

**As a bonus, we also show you how to set up webhooks on your rave dashboard so as to get notified of successful transactions.** You can find more information here about [Rave and Webhooks](https://developer.flutterwave.com/v2.0//docs#webhooks).

To see webhooks in action, follow the [Creating a sample 3dsecure App](#) steps above and then run the following commands.

```
 # in your generated 3dsecure sample app folder
 rave init heroku

 rave init git https://the-heroku-gitUrl-created-for-you (e.g  https://git.heroku.com/rave-3dsecurexxxxxx.git)

```
By now you should be seeing a heroku app url in your console. Copy it, go to your rave dashboard then do the following.

![Webhook](/webhooks.PNG)

Now you can try to do a test from the HTML page and you will see the webhook response in your ```Console```.

Webhooks are sent from Rave only when there is a **```successful```** transaction. They have to be setup in your dashboard as shown above. And they also require a secret key. 

A secret key has been created for you in the ```.env``` file of the generated project. Just copy it and place it in the secret key field as shown above. **Do not forget to save your newly updated settings.**

## Creating a sample Tokenized Card Charge App

The sample tokenized charge app shows you how to carry out tokenized card charges with the help of our Node.js Sdk.

We have provided guides on the left of the served up HTML page for you to see tokenized card charges in action. We ```strongly recommend``` that you read up those instructions so as to be able to get the appropriate card details to use for the test; as well as other vital info.

Creating the app:

```
 # make a folder
 mkdir rave-samples
 cd rave-samples

 # generate the transfer app
 rave create --app tokenized

 # open the .env file and put in your ```Rave Sandbox``` public and secret keys

 # install all the libraries needed
 npm install

 # start the node server
 nodemon app.js

 # start the frontend server
 cd frontend/public && live-server --port=3000
```
Yay! You should have a sample tokenized card charge app all set up now. **A piece of advice: Check out the code to see how it was implemented.**

## Creating a sample Split Payment App

The sample tokenized charge app shows you how to do split payments with the help of our Node.js Sdk.

We have provided guides on the left of the served up HTML page for you to see split payments in action. We ```strongly recommend``` that you read up those instructions so as to be able to get the appropriate card details to use for the test; as well as other vital info.

Creating the app:

```
 # make a folder
 mkdir rave-samples
 cd rave-samples

 # generate the transfer app
 rave create --app split

 # open the .env file and put in your ```Rave Sandbox``` public and secret keys

 # install all the libraries needed
 npm install

 # start the node server
 nodemon app.js

 # start the frontend server
 cd frontend/public && live-server --port=3000
```
Yay! You should have a sample split payments app all set up now. **A piece of advice: Check out the code to see how it was implemented.**

# NEED HELP?

The CLI has a built in ```help``` command. All you just need do is run the command below:

```
 rave help
```
To get help for a particular command, just specifiy the command name after help like so:

```
 # help on how to use init command
 rave help init
```

## Meta

Distributed under the MIT license. See ```LICENSE``` for more information.

[Joshua Boateng](https://github.com/Jake-parkers/)

## Contributing

1. Fork it (<https://github.com/Jake-parkers/rave-cli/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

<!-- Markdown link & img dfn's -->
[npm-image]: https://img.shields.io/npm/v/datadog-metrics.svg?style=flat-square
[npm-url]: https://npmjs.org/package/datadog-metrics
[npm-downloads]: https://img.shields.io/npm/dm/datadog-metrics.svg?style=flat-square
[travis-image]: https://img.shields.io/travis/dbader/node-datadog-metrics/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/dbader/node-datadog-metrics
[wiki]: https://github.com/yourname/yourproject/wiki
