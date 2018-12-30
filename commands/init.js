const execSync = require('child_process').execSync;
const exec = require('child_process').exec;
const fs = require('fs');
const uuid = require('uuid/v4');
const errorHandler = require('../utils/error');
const Spinner = require('ora');
const randomColor = require('../utils/random');

module.exports = (args) => {
    const spinner = Spinner({
        text: `Generating ${args._[1]}...`,
        color: randomColor(),
        spinner: {
            interval: 80,
            frames: ["⠋"]
        }
    }).start();

    switch (args._[1]) {
        case "heroku":
            if(!args._[1]) { // api key not provided
                errorHandler(`Hey you didn't add your ${args._[1]} api key`, false);
                require('./help')({_:["help", "init"]});
                errorHandler("", true); // exit the process
            }
            // add api key as an environment variable
            process.env["HEROKU_API"] = args._[2];
            let appDetails = createHerokuApp(spinner);
            break;
        case "git":
            // gun git commands
            if(!args._[1]) { // remote url not provided
                errorHandler(`Hey you didn't add your ${args._[1]} remote url`, false);
                require('./help')({_:["help", "init"]});
                errorHandler("", true); // exit the process
            }
            createGitIgnoreFile(spinner);
            try {
                console.log("git add");
                execSync('git add .');
                console.log("git remote")
                execSync('git remote add origin '+args._[2]);
                console.log("git commit")
                execSync('git commit -m "Initial Commit"');
                console.log("git push")
                execSync('git push heroku master');
                spinner.succeed();
            }catch(err) {
                errorHandler(err, true);
                spinner.fail();
            }
            break;
        default:
            errorHandler("Oops!!! Seems like you entered a wrong command", false);
            require('./help')({_:["help", "init"]});
            break;
    }
}


createHerokuApp = (spinner) => {
    try {
        execSync('git init');
        let b = uuid();
        let command = 'heroku create rave-3dsecure'+b.slice(0, b.indexOf('-'));
        console.log(command);
        exec(command, (err, stdout, stderr) => {
            if(err) errorHandler(err+'\n'+stderr, true);
            spinner.succeed('\n'+stdout);
        });
    }catch(err) {
        spinner.fail();
        errorHandler(err, true);
    }
}

createGitIgnoreFile = (spinner) => {
    try {
        execSync('touch '+ process.cwd() + "/.gitignore");
        let fd = fs.openSync(process.cwd() + "/.gitignore", 'a+');
        let bytesWritten = fs.writeSync(fd, 'node_modules\nfrontend');
        if(bytesWritten <= 0) errorHandler("Oops!!! we could not create a .gitignore file. Kindly create one and add node_modules and .env to it", true);
        else console.log('.gitignore file generated successfully');
    }catch(err) {
        errorHandler("An error occurred\n"+err, true);
        spinner.fail();
    }
}