const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const Token = require('../AuthModels/Token.model');
const {generateAccessToken} = require("../Scripts/TokenFunctions");

// Auth Route to give user an access token if they have a proper refresh token.
router.post('/', ((req, res) => {

        // Look at the token we got in the request and see if it is null or if it is good.
        const refreshToken = req.body.token;

        // If the user did not pass any token.
        if(refreshToken == null) {
            return res.status(401);
        }

        // Take token we got and continue.
        else{

            // Check if refresh token is inside DB.
            Token.findOne({RefreshToken: refreshToken}, function (err, token){
                // Error Handling.
                if(err){
                    return res.sendStatus(403)
                }
                // If the token is not in our DB.
                else if(token == null){
                    return res.sendStatus(403);
                }

                else {

                    // Verify this is the token by passing our secret.
                    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                        if (err) return res.sendStatus(403)

                        // Create an access token for the user. This token lasts for 5 minutes.
                        const accessToken = generateAccessToken({ email: user.email })

                        // Send the token.
                        res.json({ accessToken: accessToken })
                    })
                }
            })
        }
}))

module.exports = {router};