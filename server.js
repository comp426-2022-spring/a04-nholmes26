// Allow require in js module
import { createRequire } from 'module';
import morgan from 'morgan';
import logdb from './logdb.cjs';
const require = createRequire(import.meta.url)

// Require express
const express = require('express')
const app = express()

// Require minimist, set up port with default of 5000
const args = require('minimist')(process.argv.slice(2))
args['port']
const port = args['port'] || process.env.PORT || 5000

// Import necessary coin functions
import { coinFlip, coinFlips, countFlips, flipACoin } from "./modules/coin.mjs";

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

app.use(function(req, res){
    // Default response for any other request
    res.status(404).send('404 NOT FOUND')
});

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
    next();
})

// Import database
require('./logdb.cjs');

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

const fs = require('fs');
// Use morgan for logging to files
// Create a write stream to append (flags: 'a') to a file
const WRITESTREAM = fs.createWriteStream('access.log', { flags: 'a' });
// Set up the access logging middleware
app.use(morgan('accesslog', { stream: WRITESTREAM }));