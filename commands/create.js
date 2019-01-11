const errorHandler = require('../utils/error');
const path = require('path')
const execSync = require('child_process').execSync;
const Spinner = require('ora');
const randomColor = require('../utils/random');
const fse = require('fs-extra');
const os = require('os');

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
        // execSync('mkdir '+copyPath);
        fse.copy(appPath, copyPath, function(error) {
            if (error) {
                console.error('Copy failed: ' + error);
                spinner.fail();
            } else {
                spinner.succeed('Project copied');
            }
        });
    }catch(err) {
        spinner.fail();
        errorHandler(`Could not create ${args["app"]} app. See available apps below\n ${err}`, false);
        require('./help')({_:["help", "create"]});
    }

    try {
        // store project path in a temp directory to aid removal
        let store_command = os.platform() == 'win32' ? path.normalize('C:/Windows/Temp') : path.normalize('/var/temp');
        let fd = fse.openSync(store_command + '/.store','w');
        console.log(process.cwd());
        fse.writeSync(fd, 'sample_apps_dir='+ process.cwd() +"\n");
    }catch(error) {
        console.log("");
    }
}