const mongoose = require('mongoose');

require('dotenv').config();

const db_connection_string = process.env.DB_CONNECTION_STRING;

const db = mongoose.connect(db_connection_string)

module.exports = {db}