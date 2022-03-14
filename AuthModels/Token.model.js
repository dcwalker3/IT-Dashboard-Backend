const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const TokenSchema = new mongoose.Schema({
    RefreshToken: {
        type: String,
        required: true
    }
}, {timestamps: true})

TokenSchema.methods.setRefreshToken = function (user) {
    this.RefreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    return this.RefreshToken;
}

// Exports and add model.
const Token = mongoose.model('tokens', TokenSchema);
module.exports = Token;