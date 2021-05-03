const userModel = require('../model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.users_signup_user = (req, res) => {

    const {name, email, password} = req.body

    bcrypt.hash(password, 10, (err, hash) => {
        if(err){
            return res.status(500).json({
                msg : err.message
            })
        }
        else{
            userModel
                .findOne({email})
                .then(user => {
                    if(user){
                        return res.status(401).json({
                            msg : "user email, please other email"
                        })
                    }
                    else{
                        const newUser = new userModel(
                            {
                                name,
                                email,
                                password : hash
                            }
                        )

                        newUser
                            .save()
                            .then(user => {
                                res.json({
                                    msg : "register user",
                                    userInfo : {
                                        id : user._id,
                                        name : user.name,
                                        email : user.email,
                                        password : user.password
                                    }
                                })
                            })
                            .catch(err => {
                                res.status(500).json({
                                    msg : err.message
                                })
                            })
                    }
                })
                .catch(err => {
                    res.status(500).json({
                        msg : err.message
                    })
                })
        }
    })
};

exports.users_login_user = (req, res) => {

    const {email, password} = req.body

    userModel
        .findOne({email})
        .then(user => {
            if(!user){
                return res.status(401).json({
                    msg : "user email, please other email"
                })
            }
            else{
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err || isMatch === 'false'){
                        return res.status(402).json({
                            msg : "not match password"
                        })
                    }
                    else{
                        const token = jwt.sign(
                            {id : user._id, email : user.email},
                            process.env.SECRET_KEY,
                            {expiresIn: '1h'}
                        )

                        res.json({
                            msg : "successful login",
                            userInfo : {
                                id : user._id,
                                name : user.name,
                                email : user.email,
                                password : user.password,
                            },
                            tokenInfo : token
                        })
                    }
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                msg : err.message
            })
        })
};