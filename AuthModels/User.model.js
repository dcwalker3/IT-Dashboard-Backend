const mongoose = require('mongoose');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 3
    },
    role: {
        type: String
    },
    hash: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    }
});

// Method to set salt and hash the password for a user
UserSchema.methods.setPassword = function(password) {

    // Creating a unique salt for a particular user
    this.salt = crypto.randomBytes(16).toString('hex');

    // Hashing user's salt and password with 1000 iterations,

    this.hash = crypto.pbkdf2Sync(password, this.salt,
        1000, 64, `sha512`).toString(`hex`);
};

// Method to check the entered password is correct or not
UserSchema.methods.validPassword = function(password) {
    console.log('At method')
    const hash = crypto.pbkdf2Sync(password,
        this.salt, 1000, 64, `sha512`).toString(`hex`);
    return this.hash === hash;
};

// Exports and add model.
const User = mongoose.model('Users', UserSchema);
module.exports = User;