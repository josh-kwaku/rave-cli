const errorHandler = require('../utils/error');
const path = require('path')
const execSync = require('child_process').execSync;
const Spinner = require('ora');
const randomColor = require('../utils/random');
const inquirer = require('inquirer');
const fs = require('fs');

module.exports = (args) => {
    console.log(args);
    if(args['SANDBOX_PUBLIC_KEY']) {
        inquirer.prompt({
            type: 'input',
            message: 'Enter Your Rave Sandbox Public Key: ',
            name: 'RAVE_PUBLIC_KEY'
        }).then(answer => {
            let spinner = Spinner({
                text: `Setting SANDBOX_PUBLIC_KEY`,
                color: randomColor(),
                spinner: {
                    interval: 80,
                    frames: ["⠋"]
                }
            }).start();
            if(!answer["RAVE_PUBLIC_KEY"]) errorHandler('Please enter your rave public key');
            let fd = fs.openSync(process.cwd() + '/.env','a');
            let bytesWritten = fs.writeSync(fd, '\nRAVE_PUBLIC_KEY='+answer["RAVE_PUBLIC_KEY"]+"\n");
            if(bytesWritten) spinner.succeed('SANDBOX_PUBLIC_KEY SET');
            else spinner.fail();
        });
    }else if(args['SANDBOX_SECRET_KEY']) {
        inquirer.prompt({
            type: 'input',
            message: 'Enter Your Rave Sandbox Secret Key: ',
            name: 'RAVE_SECRET_KEY'
        }).then(answer => {
            let spinner = Spinner({
                text: `Setting SANDBOX_PUBLIC_KEY`,
                color: randomColor(),
                spinner: {
                    interval: 80,
                    frames: ["⠋"]
                }
            }).start();
            if(!answer["RAVE_SECRET_KEY"]) errorHandler('Please enter your rave public key');
            let fd = fs.openSync(process.cwd() + '/.env','a');
            let bytesWritten = fs.writeSync(fd, '\nRAVE_SECRET_KEY='+answer["RAVE_SECRET_KEY"]+"\n");
            if(bytesWritten) spinner.succeed('SANDBOX_SECRET_KEY SET');
            else spinner.fail();
        });
    }else errorHandler("You can only set --SANDBOX_SECRET_KEY or --SANDBOX_PUBLIC_KEY", true)
}