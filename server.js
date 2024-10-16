const dotenv = require('dotenv');
const mongoose = require('mongoose');
process.on('uncaughtException',err=>{
    console.log('uncaught Exception! ✴️ shutting down......')
    console.log(err.name,err.message)
    process.exit(1)
})
dotenv.config({path:'./config.env'})
const app = require('./app');
const port = process.env.PORT || 8000

    
const DB = process.env.DATABASE_LOCAL
mongoose.connect(DB).then(con=>{
    console.log('DB connection successful')
})
const server = app.listen(port, ()=>{
    console.log(`App running on port ${port}`)
})

process.on('unhandledRejection',err=>{
    console.log('unhandled Rejection! ✴️ shutting down......')
    console.log(err.name,err.message)
    server.close(()=>{
        process.exit(1)
    })
    })

