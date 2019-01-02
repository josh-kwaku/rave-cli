const errorHandler = require('../utils/error');
const path = require('path')
const os = require('os');
const childProcess = require('child_process');
const Spinner = require('ora');
const randomColor = require('../utils/random');
var appPath;

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
    switch (os.platform()) {
        case 'win32':
            appPath = path.win32.normalize(path.win32.join(dirname, args['app']));
            let command = 'Xcopy /E /I ' + appPath + " " + path.win32.normalize(process.cwd());
            break;
        default:
            appPath = path.normalize(path.join(dirname, args['app']));
            let command = 'cp -r ' + appPath + " " + process.cwd();
            break;
    }
    // let appPath = path.normalize(path.join(dirname, args['app']));
    // let unixCommand = 'cp -r ' + appPath + " " + process.cwd();
    // let win32Command = 'Xcopy /E /I ' + appPath + " " + process.cwd();
    try {
        result = childProcess.execSync(command);
        spinner.succeed();
    }catch(err) {
        spinner.fail();
        errorHandler(`Could not create ${args["app"]} app. See available apps below\n ${err}`, false);
        require('./help')({_:["help", "create"]});
    }
}