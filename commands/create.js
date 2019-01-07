const errorHandler = require('../utils/error');
const path = require('path')
const os = require('os');
const childProcess = require('child_process');
const Spinner = require('ora');
const randomColor = require('../utils/random');
// const copy = require('ncp');
const fse = require('fs-extra')
var appPath;
let command;

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

    // switch (os.platform()) {
    //     case 'win32':
    //         appPath = path.win32.normalize(path.win32.join(dirname, args['app']));
    //         command = 'Xcopy /E /I ' + appPath + " " + path.win32.normalize(process.cwd());
    //         break;
    //     default:
    //         appPath = path.normalize(path.join(dirname, args['app']));
    //         command = 'cp -r ' + appPath + " " + process.cwd();
    //         break;
    // }
    try {
        let dirname = __dirname.replace('commands','samples');
        let appPath = path.normalize(path.join(dirname, args['app']));
        fse.copy(appPath, process.cwd(), function(error) {
            if (error) {
                console.error('Copy failed: ' + error);
                spinner.fail();
            } else {
                console.info('Copied files');
                spinner.succeed();
            }
        });
        // let unixCommand = 'cp -r ' + appPath + " " + process.cwd();
        // let win32Command = 'Xcopy /E /I ' + appPath + " " + process.cwd();
        // result = childProcess.execSync(command);
    }catch(err) {
        spinner.fail();
        errorHandler(`Could not create ${args["app"]} app. See available apps below\n ${err}`, false);
        require('./help')({_:["help", "create"]});
    }
}