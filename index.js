// Import the necessary dependencies
const express = require('express');
const dataStore = require('nedb')
const app = express();

// Set port to generated port from hosting service, if null defautl is 3001 
const port = process.env.PORT || 3001

// Back-end listen to clients who connect to the port
app.listen(port, () => console.log(`starting server at ${port}`))

// Target the 'public' folder and display the content
app.use(express.static('public'));

// The maxmimum limit for data to be passed between client and server
app.use(express.json({limit: '1mb'}));

// Create and load a database
const database = new dataStore('database.db');
database.loadDatabase();

// POST API 
app.post('/api', (request, response) => {
    console.log('I got a request')

    // Store the request body (client's data they sent)
    const data = request.body;

    // Create a timestamp 
    const timestamp = Date.now();
    data.timestamp = timestamp;

    // Insert the client's data into the database
    database.insert(data);

    // Send a response back to the client, can be anything 
    response.json(data);
});

// GET API
app.get('/api', (request, response) => {

    // Using find to get the information from the database <-- stored in 'data'
    database.find({}, (err, data) => {

        // If there is an error, return nothing
        if(err) {
            response.end();
            return;
        }
        
        // return the data as json format 
        response.json(data);
    });
});


