const errorHandler = require('../utils/error');
const execSync = require('child_process').execSync;
const fs = require('fs');
const os = require('os');
const path = require('path');
const Spinner = require('ora');
const randomColor = require('../utils/random');

module.exports = (args) => {
    if(!args["app"]) {
        errorHandler("Oops!!! Seems like you entered a wrong command", false);
        require('./help')({_:["help", "remove"]});
        errorHandler("", true);
    }

    // init spinner
    const spinner = Spinner({
        text: `Removing ${args["app"]}...`,
        color: randomColor(),
        spinner: {
            interval: 80,
            frames: ["⠋"]
        }
    }).start();

    try {
        // retrieve project folder from temp file and then delete specified app
        let store_command = os.platform() == 'win32' ? path.normalize('C:/Windows/Temp') : path.normalize('/var/temp');
        fs.readFile(store_command + '/.store',(err, data) => {
            if(err) throw err;
            let file_data = data.toString();
            let project_path = file_data.split('=')[1].trim();
            execSync('rm -rf ' + path.normalize(project_path + "/" + args["app"]));
            spinner.succeed(args["app"] +" app removed");
        })
    }catch(error) {
        spinner.fail();
        errorHandler(error, true);
    };
}