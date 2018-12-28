// const fs = require('fs');
// // load environment variables into current process
// let env_variable = fs.readFileSync("./.env");
// let envs = env_variable.toString().split('\n');
// envs.forEach(env_variable => {
//     let variable = env_variable.split('=')[0];
//     let value = env_variable.split('=')[1].replace("\r","");
//     process.env[variable] = value
// });
require('dotenv').config();
const app = require('express')();
const bodyParser = require('body-parser');
const morgan = require('morgan');

var port = process.env.PORT || 80 // 2. Using process.env.PORT

// app.use(cors(corsOptions));

app.use(function (req, res, next) {
    // 'https://hidden-earth-62758.herokuapp.com'
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization,Accept');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

const rave = require('./rave');

app.use(bodyParser.urlencoded({extended:false, limit: '10mb'}));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send({message: '3dsecure Sample'});
})

app.use('/rave', rave);

app.set('port', port);
app.listen(port, '', () => {
     console.info('App listening on port %s', port);
})

