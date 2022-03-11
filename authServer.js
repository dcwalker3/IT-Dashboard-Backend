// Initialize CORS and express.
const express = require('express');
const cors = require('cors');

// Create server instance.
const app = express();

// JSON support for the server whether it be multipart form data
// or standard JSON.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json());

// Add CORS middleware to our server.
app.use(cors({
    origin: 'http://localhost:8080'
}))

// Enable .env file variables to be read.
require('dotenv').config();

// Set the port we are going to use.
const port = process.env.AUTH_SERVER_PORT || 3000

// Create Mongoose Connection
const mongoose = require('./Database/conn');

// Importing Routes to server file.
const Users = require('./AuthRoutes/Users');

// Adding Routes to server paths.
app.use('/user', Users);

// Have our  server start listening.
app.listen(port, () => {
    console.log(`Authentication Server Listening on port ${port}`);
});