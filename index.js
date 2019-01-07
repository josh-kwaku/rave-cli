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
            break;
        case 'create':
            require('./commands/create')(args);
            break;
        case 'init':
            require('./commands/init')(args);
            break;
        case 'set':
            require('./commands/set')(args);
            break;
        case 'remove':
            require('./commands/remove')(args);
            break;
        case 'test':
            console.log("We're about to perform tests");
            break;
        default:
            errorHandler("Oops!!! Seems like you entered a wrong command", false);
            require('./commands/help')(args);
            break;
    }
}