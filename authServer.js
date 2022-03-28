// Initialize CORS and express.
const express = require('express');
const cors = require('cors');

// Mongo Sanitize is made to act as the first layer in preventing injection attacks.
// TODO: Create own second layer for injection attack protection.
const mongoSanitize = require('express-mongo-sanitize');

// Create server instance.
const app = express();

// JSON support for the server whether it be multipart form data
// or standard JSON.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json());

// Have our server use mongo sanitize.
app.use(mongoSanitize());

// Add CORS middleware to our server.
app.use(cors({
    origin: 'http://localhost:8080'
}))

// Enable .env file variables to be read.
require('dotenv').config();

// Set the port we are going to use.
const port = process.env.AUTH_SERVER_PORT || 3000

const conn = require('./Database/conn');

// Importing Routes to server file.
const Users = require('./AuthRoutes/Users');
const Tokens = require('./AuthModels/Token.model');

// Adding Routes to server paths.
app.use('/user', Users);
app.use('/token', Tokens);


app.get('/', (req, res) => {
    res.send("Hello World");
})
// Have our  server start listening.
app.listen(port, () => {
    console.log(`Authentication Server Listening on port ${port}`);
});