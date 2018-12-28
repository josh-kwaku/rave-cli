// get version from package.json
const { version } = require('../package.json');

module.exports = () => {
    console.log(`v${version}`);
}