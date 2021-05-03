const userModel = require('../model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.users_signup_user = async (req, res) => {

    const {name, email, password} = req.body

    try{
        const user = await userModel.findOne({email})
        if(user){
            return res.status(400).json({
                msg : "user email, please other email"
            })
        }
        else{
            const user = new userModel({
                name, email, password
            })

            await user.save()
            res.json(user)
        }



    }catch(err){
        res.status(500).json({
            msg : err.message
        })
    }

};

exports.users_login_user = async (req, res) => {

    const {email, password} = req.body

    try{

       const user = await userModel.findOne({email})
        if(!user){
            return res.status(400).json({
                msg : 'user email, please other email'
            })
        }
        else{
            await user.comparePassword(password, (err, isMatch) => {
                if(err || !isMatch){
                    return res.status(400).json({
                        msg : "not match password"
                    })
                }
                else{

                    const payload = {
                        id : user._id,
                        email : user.email
                    }

                    const token = jwt.sign(
                        payload,
                        process.env.SECRET_KEY,
                        {expiresIn: '1h'}
                    )

                    res.json({token})
                }

            })
        }


    }catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};