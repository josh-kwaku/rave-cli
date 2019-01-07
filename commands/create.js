const errorHandler = require('../utils/error');
const path = require('path')
const execSync = require('child_process').execSync;
const Spinner = require('ora');
const randomColor = require('../utils/random');
const fse = require('fs-extra')

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

    try {
        let dirname = __dirname.replace('commands','samples');
        let appPath = path.normalize(path.join(dirname, args['app']));
        let copyPath = path.normalize(process.cwd()+"/"+args['app']);
        execSync('mkdir '+copyPath + ' && cd ' +copyPath);
        fse.copy(appPath, copyPath, function(error) {
            if (error) {
                console.error('Copy failed: ' + error);
                spinner.fail();
            } else {
                spinner.succeed('Project copied');
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