const express = require('express');
const router = express.Router();

// Models we used to interact with our DB.
const User = require('../AuthModels/User.model');
const Token = require('../AuthModels/Token.model');

// Token Functions such as how to generate access token.
const {generateAccessToken} = require("../Scripts/TokenFunctions");

// API Route to signup user.
router.post('/signup', ((req, res, next) => {

    // Create user and then set its password.
    let newUser = new User();
    newUser.email = req.body.email;
    newUser.setPassword(req.body.password);


    // Save the user to our database.
    newUser.save(function(err, User) {
        if(err){
            // Duplicate unique key entry error(a.k.a. This email is already in our database).
            if(err.code === 11000){
                return res.sendStatus(409)
            }

            // Generic error.
            return res.sendStatus(400);
        } else{
            // Create a simple user body.
            // We are using this instead of newUser, so we don't pass the hash or salt.
            const user = {
                email: newUser.email
            };

            // Set Access Token
            const accessToken = generateAccessToken(user);

            // Set Refresh Token
            const token  = new Token();
            const refreshToken = token.setRefreshToken(user);

            // Save the token.
            token.save(function (err) {

                // Generic error handler.
                if(err){
                    console.log(err);
                    res.status(400)
                }
            })

            // Send the tokens back to the user.
            return res.status(201).json({
                accessToken: accessToken,
                refreshToken: refreshToken
            })
        }
    })
}))

// API Route to log out.
router.delete('/logout', (req, res) => {
    // Delete the Refresh Token so bad actors can't use it to impersonate a user that has signed out.
    Token.deleteOne({RefreshToken: req.body.token})
        .then(res.sendStatus(204));
})


// API Route to log in.
router.post('/login', (req, res) => {

    // Find user with requested email
    User.findOne({ email : req.body.email }, function(err, user) {
        if (user === null) {
            return res.status(400).send({
                message : "User not found."
            });
        }
        else {
            // Validate correct password was passed.
            if (user.validatePassword(req.body.password)) {
                // Create a simple user body.
                // We are using this instead of newUser, so we don't pass the hash or salt.
                const tokenUser = {
                    email: user.email
                };

                // Set Access Token
                const accessToken = generateAccessToken(tokenUser);

                // Set Refresh Token
                const token  = new Token();
                const refreshToken = token.setRefreshToken(tokenUser);

                // Save the token.
                token.save(function (err) {
                    if(err){
                        console.log(err);

                        res.status(401).json({
                            msg: 'User logged in, but unable to provide token.',
                            error: err
                        });
                    }
                })

                // Send our tokens back.
                return res.status(201).json({
                    accessToken: accessToken,
                    refreshToken: refreshToken
                })
            }

            // Passwords don't match.
            else {
                // Send error code.
                return res.sendStatus(400)
            }
        }
    });
});

module.exports = router;