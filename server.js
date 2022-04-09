// Require express
var express = require('express')
var app = express()
// Require database and md5
const db = require("./logdb.js")
// Express to use built-in body parsernp
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Require minimist, set up port with default of 5000
const args = require('minimist')(process.argv.slice(2))
args['port']
const port = args['port'] || process.env.PORT || 5000
// set up help menu
if (args['help']) {
    console.log(`server.js [options]

    --port	Set the port number for the server to listen on. Must be an integer
                between 1 and 65535.
  
    --debug	If set to \`true\`, creates endlpoints /app/log/access/ which returns
                a JSON access log from the database and /app/error which throws 
                an error with the message "Error test successful." Defaults to 
                \`false\`.
  
    --log		If set to false, no log files are written. Defaults to true.
                Logs are always written to database.
  
    --help	Return this message and exit.`)
    exit(EXIT_SUCCESS)
}

// Import necessary coin functions
const coinfuncs = require("./modules/coin.js");

// Start an app server
const server = app.listen(port, () => { 
    console.log('App listening on port %PORT%'.replace('%PORT%',port))
});

app.get('/app/', (req, res) => { // Define Checkpoint
    // Respond with status 200
    res.statusCode = 200;
    // Respond with status message "OK"
    res.statusMessage = 'OK';
    res.writeHead( res.statusCode, { 'Content-Type' : 'text/plain' });
    res.end(res.statusCode+ ' ' +res.statusMessage)
});

app.get('/app/flip/', (req, res) => { // Flip a coin and return the result
    // Respond with status 200
    res.statusCode = 200;
    // Flip a coin using the coinFlip() function
    const result = coinFlip();
    // Send json response based of heads or tails from resulting coin flip
    if (result == 'heads') {
        res.json({"flip":"heads"});
    } 
    if (result == 'tails') {
        res.json({"flip":"tails"});
    } 
});

app.get('/app/flips/:number', (req, res) => { // Flip a coin multiple times and return the results
    // Respond with status 200
    res.statusCode = 200;
    // Set up variable for number of coin flips, array of results, and counted results
	const flips = req.params.number;
    const results = coinFlips(flips);
    const counted = countFlips(coinFlips(flips));
	// Flip coin "flips" number of times using the coinFlips function, send json response of results
    res.json({"raw":results, "summary":counted});
    // send json response of results
});

app.get('/app/flip/call/heads', (req, res) => { // Flip a coin, call heads, compare result
    // Respond with status 200
    res.statusCode = 200;
       // Use flipACoin function, send json response of results
    res.json(flipACoin('heads'));
});

app.get('/app/flip/call/tails', (req, res) => { // Flip a coin, call heads, compare result
    // Respond with status 200
    res.statusCode = 200;
    // Use flipACoin function, send json response of results
    res.json(flipACoin('tails'));
});

if (args['log'] == true) {
    const fs = require('fs');
    // Use morgan for logging to files
    // Create a write stream to append (flags: 'a') to a file
    const WRITESTREAM = fs.createWriteStream('access.log', { flags: 'a' });
    // Set up the access logging middleware
    app.use(morgan('accesslog', { stream: WRITESTREAM }));
}

//Middleware
app.use( (req, res, next) => {
    let logdata = {
        remoteaddr: req.ip,
        remoteuser: req.user,
        time: Date.now(),
        method: req.method,
        url: req.url,
        protocol: req.protocol,
        httpversion: req.httpVersion,
        secure: req.secure,
        status: res.statusCode,
        referer: req.headers['referer'],
        useragent: req.headers['user-agent']
    }
    const stmt = db.prepare(`INSERT INTO accesslog (remoteaddr, remoteuser, time, method, url, protocol, httpversion, secure, status, referer, useragent) VALUES (null, null, null, null, null, null, null, null, null, null, null)`)
    
    const info = stmt.run(logdata.remoteaddr, logdata.remoteuser, logdata.time,
            logdata.method, logdata.url, logdata.protocol,
            logdata.httpversion, logdata.secure, logdata.status,
            logdata.referer, logdata.useragent)
    next();
})

if (args['debug'] == true) {
    // Endpoint to return all records in accesslog
    app.get('/app/log/access', (req, res) => {
        res.statusCode = 200;
        res.json(logdb);
    });

    //Endpoint to return errors
    app.get('/app/error', (req, res) => {
        res.statusCode = 200;
        function errorHandler (err, req, res, next) {
            if (res.headersSent) {
            return next(err)
            }
            res.status(500)
            res.render('Error test successful.', { error: err })
        }
    });
}

app.use(function(req, res){
    // Default response for any other request
    res.status(404).send('404 NOT FOUND')
});