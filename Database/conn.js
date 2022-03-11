const mongoose = require('mongoose');

require('dotenv').config();

const db_connection_string = process.env.DB_CONNECTION_STRING;
console.log(db_connection_string)

const db = mongoose.connection;

db.on('open', () => {
    console.log('Successful Connection!')
})

db.on('error', (error) => {
    console.log(error);
})

module.exports = {mongoose}