const mongoose = require('mongoose')

// const options = {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex : true,
//     useFindAndModify : false
// }
//
// mongoose
//     .connect(process.env.MONGODB_URI, options)
//     .then(_ => console.log("connected mongodb..."))
//     .catch(err => console.log(err))

const connectDB = async () => {

    try{
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex : true,
            useFindAndModify : false
        })
        console.log("connected mongodb...")
    }catch (err){
        console.log(err)

        // 비정상 종료
       process.exit(1)
    }
}

module.exports = connectDB