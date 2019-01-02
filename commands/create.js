const errorHandler = require('../utils/error');
const path = require('path')
const os = require('os');
const childProcess = require('child_process');
const Spinner = require('ora');
const randomColor = require('../utils/random');

module.exports = (args) => {

    if(!args["app"]) {
        errorHandler("Oops!!! Seems like you entered a wrong command", false);
        require('./help')({_:["help", "create"]});
        errorHandler("", true);
    }

    // generate requested app

    // initialize spinner
    const spinner = Spinner({
        text: `Generating ${args["app"]}...`,
        color: randomColor(),
        spinner: {
            interval: 80,
            frames: ["⠋"]
        }
    }).start();

    let dirname = __dirname.replace('commands','samples');
    let appPath = path.normalize(path.join(dirname, args['app']));
    let command = 'cp -r ' + appPath + " " + process.cwd();
    try {
        result = childProcess.execSync(command);
        spinner.succeed();
    }catch(err) {
        spinner.fail();
        errorHandler(`Could not create ${args["app"]} app. See available apps below\n ${err}`, false);
        require('./help')({_:["help", "create"]});
    }
}