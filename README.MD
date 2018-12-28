<!-- ![Rave](https://flutterwave.com/wp-content/themes/flutterwave/images/flutterthings.png) -->
# RAVE CLI
> The easiest way to make and accept payments from customers anywhere in the world.

<!-- [![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Downloads Stats][npm-downloads]][npm-url] -->

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

```
All Rave CLI samples are run using Node.js ```8.12.0``` or higher. If you haven't yet installed Node.js, you can do so [here](https://nodejs.org).

You obviously need to have a ````Rave Sandbox``` account. You can create one [here](https://rave.flutterwave.com/login?_ga=2.52042537.1235922808.1545914614-813837257.1545375560).

To see the webhook sample in action, you will need to create a [Pusher Account](https://pusher.com/)

Install live-server globally ```npm install -g live-server```

```
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

 # open the .env file and put in your Rave Sandbox public and secret keys

 # install all the libraries needed
 npm install

 # start the node server
 nodemon app.js

 # start the frontend server
 cd frontend/public && live-server --port=3000
```
You should now have a working local app. Read and follow the instructions on the left of the served up page.


# Creating a Sample App

> Here's a Tip: If this is your first time here, see the [Quick Start Above](#)

Creating an App can be done entirely locally and they are fairly simple Node.js apps using the standard Node environment and should be completely useable and understandable.

## Sample Apps folder structure

![Folder Structure](/samples_folder_structure.png)

## Creating a sample Transfer App

The sample transfer app shows you how to initiate single and bulk transfers with the help of our Node.js Sdk.

We have provided guides on the left of the served up HTML page for you to see transfers in action. We ```strongly recommend``` that you read up those instructions so as to be able to get the appropriate account details to use for the test; as well as other vital info.

All sucessful transfers will be queued in your Rave dashboard under transfers. Kindly check them out.

Creating the app:

```
 # make a folder
 mkdir rave-samples
 cd rave-samples

 # generate the needed app
 rave create --app appname

 # open the .env file and put in your ```Rave Sandbox``` public and secret keys

 # install all the libraries needed
 npm install

 # start the node server
 nodemon app.js

 # start the frontend server
 cd frontend/public && live-server --port=3000
```

## Release History

* 0.2.1
    * CHANGE: Update docs (module code remains unchanged)
* 0.2.0
    * CHANGE: Remove `setDefaultXYZ()`
    * ADD: Add `init()`
* 0.1.1
    * FIX: Crash when calling `baz()` (Thanks @GenerousContributorName!)
* 0.1.0
    * The first proper release
    * CHANGE: Rename `foo()` to `bar()`
* 0.0.1
    * Work in progress

## Meta

Your Name – [@YourTwitter](https://twitter.com/dbader_org) – YourEmail@example.com

Distributed under the XYZ license. See ``LICENSE`` for more information.

[https://github.com/yourname/github-link](https://github.com/dbader/)

## Contributing

1. Fork it (<https://github.com/yourname/yourproject/fork>)
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
