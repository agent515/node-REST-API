const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../model/user.js');

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

exports.users_get_all = (req, res, next) => {
    User.find()
    .exec()
    .then( users => {
        const response = {
            count : users.length,
            users : users.map(user => {
                return {
                    email : user.email,
                    _id : user._id,
                    request : {
                        type : "GET",
                        url : "http://localhost:3000/users/" + user._id
                    }
                }
            })
        }
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        });
    });
}


exports.user_signup = (req, res, next) => {
    if(!validateEmail(req.body.email)) {
        return res.status(400).json({
            message : "Invalid email"
        });    
    }

    User.find({ email : req.body.email })
    .exec()
    .then( user => {
        if(user.length >= 1) {
            return res.status(409).json({
                message : "email is already in use"
            });
        }
        else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) {
                    return res.status(500).json({
                        error : err
                    });
                }
                else {
                    const user = new User({
                        _id : mongoose.Types.ObjectId(),
                        email : req.body.email,
                        password : hash
                    });
                    
                    user.save()
                    .then(user => {
                        res.status(201).json({
                            message : "User created successfully"
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error : err
                        });
                    });
                }
            });
            
        }
    } )
    .catch(err => {
        console.log(err);

        res.status(500).json({
            error : err
        });
    });

}

exports.user_login = (req, res, next) => {
    User.find({ 
        email : req.body.email,
    })
    .exec()
    .then(user => {
        if(user.length < 1) {
            return res.status(401).json({
                message : "Auth failed"
            });
        }
        else {
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if(err) {
                    return res.status(401).json({
                        message : "Auth failed"
                    });
                }
                if(result){        //if true... valid
                    const token = jwt.sign(
                    {
                        email : req.body.email,
                        _id : user[0]._id
                    },
                    process.env.JWT_AUTH_KEY,
                    {
                       expiresIn : '1h' 
                    });

                    return res.status(200).json({
                        message : "Auth successfully",
                        token : token
                    });
                }
                else {
                    return res.status(401).json({
                        message : "Auth failed"
                    });
                }
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        });
    });
}

exports.user_delete = (req, res, next) => {
    User.remove({ _id : req.params.userId })
    .exec()
    .then(result => {
        res.status(200).json({
            message : "Deleted the user"
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        });
    });
}