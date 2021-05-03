const mongoose = require('mongoose')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const normalize = require('normalize-url')

const userSchema = mongoose.Schema(
    {
        name : {
            type: String
        },
        email : {
            type : String,
            required : true,
            unique : true,
            match : /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        },
        password : {
            type : String,
            required: true
        },
        profileImage : {
            type :String
        },
        role : {
            type : String,
            default : "user"
        }
    },
    {
        timestamps : true
    }
)

userSchema.pre('save', async function(next){
    try{

        console.log('entered')
        // profileImage 생성
        const avatar = normalize(
            gravatar.url(this.email, {
                s : '200',
                r : 'pg',
                d : 'mm'
            }),
            {forceHttps: true}
        )

        this.profileImage = avatar
        // password 암호화
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(this.password, salt)

        this.password = passwordHash

        console.log('exited')

        next()
    }catch (err){
        next(err)
    }
})

module.exports = mongoose.model('user', userSchema)