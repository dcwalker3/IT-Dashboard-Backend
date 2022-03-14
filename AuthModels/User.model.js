const mongoose = require('mongoose');
const crypto = require('crypto');

// Schema Model we use for when we create or edit a user document.
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
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
}, {timestamps: true});

// Function to set the password in our database.
UserSchema.methods.setPassword = function (password) {
    // Create salt from getting 32 bytes then converting to hex.
    this.salt = crypto.randomBytes(32).toString('hex');

    // Hashing password with 64 length and 1000 iterations. Use sha512 digest.
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString('hex')
}

// Function to validate password by hashing the password provided and then comparing it to our stored password.
UserSchema.methods.validatePassword = function (password){
    // Hash password provided the same way in setPassword().
    let hash = crypto.pbkdf2Sync(password,
        this.salt,
        1000,
        64,
        `sha512`).toString(`hex`);

    // Compare and then return true or false depending on if they match.
    return this.hash === hash;
}

// Exports and add model.
const User = mongoose.model('users', UserSchema);
module.exports = User;