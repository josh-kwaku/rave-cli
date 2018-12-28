const minimist = require('minimist');
const errorHandler = require('./utils/error');

module.exports = () => {
    // cli arguments - skip first arg as it is "rave" 
    const args = minimist(process.argv.slice(2));
    let initiator = args._[0] || 'help';
    let command = args._[1];

    switch(initiator) {
        case 'help':
            require('./commands/help')(args);
            break;
        case 'version':
            require('./commands/version')(args);
        case 'create':
            require('./commands/create')(args);
            break;
        case 'set':
            require('./commands/set')(args);
            break;
        case 'init':
            require('./commands/init')(args);
            break;
        case 'test':
            console.log("We're about to perform tests");
            break;
        default:
            errorHandler("Oops!!! Seems like you entered a wrong command", false);
            require('./commands/help')(args);
            break;
    }
    
    // if(initiator == "run") {
    //     // perform wonders here
    //     switch (command) {
    //         case "init":
    //             require('./commands/init')(args)
    //             break;
    //         case "start-server":
    //         console.log(`Rave Sample Apps Running on Port 80`);
    //             require('./commands/start_script')(args)
    //             break;
    //         default:
    //             errorHandler("Oops!!! Seems like you entered a wrong command", false);
    //             require('./commands/help')(args);
    //             break;
    //     }

    // }else if (initiator == "test") {
    //     // perform tests here
    //     console.log("We're about to perform tests");

    // } else if (initiator == "help") {

    //     require('./commands/help')(args);

    // }else if (initiator == "version") {

    //     require('./commands/version')(args);

    // }else {

    //     errorHandler("Oops!!! Seems like you entered a wrong command", false);
    //     require('./commands/help')(args);

    // }
}