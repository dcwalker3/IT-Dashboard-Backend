const express = require('express');
const router = express.Router();

const User = require('../AuthModels/User.model');

router.post('/signup', ((req, res, next) => {
   console.log('Request Recieved!');

    let user = new User();

    user.email = req.body.email;
    user.password = req.body.password
    user.setPassword(req.body.password)

    user.save((err, User) => {
        if(err){
            console.log(err)
            return res.status(400).json({
                message: 'Failed to add user!',
                error: err
            });
        } else {
            return res.status(201).send({
                message: `User ${User.email} Successfully Added`
            })
        }
    })


}))

router.post('/login', ((req, res) => {
    // Find user with requested email
    User.findOne({ email : req.body.email }, function(err, user) {
        if (user === null) {
            return res.status(400).send({
                message : "User not found."
            });
        }
        else {
            console.log(user);
            if (user.validPassword(req.body.password)) {
                return res.status(201).send({
                    message : "User Logged In",
                })
            }
            else {
                return res.status(400).send({
                    message : "Wrong Password"
                });
            }
        }
    });
}));

module.exports = router;