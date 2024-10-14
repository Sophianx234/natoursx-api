const app = require('./app');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({path:'./config.env'})
const port = process.env.PORT || 8000

const DB = process.env.DATABASE_LOCAL
mongoose.connect(DB).then(con=>{
    console.log('DB connection successful')
})

app.listen(port, ()=>{
    console.log(`App running on port ${port}`)
})