const { default: mongoose } = require("mongoose");
const User = require("../../models/userModel");
const fs = require("fs");
const dotenv = require('dotenv')
dotenv.config({path: './config.env'})

const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`));
const importUsers = async () => {
  await User.create(users);
  console.log("users imported successfully");
  process.exit();
};
const deleteUsers = async () => {
  await User.deleteMany();
  console.log("users deleted successfully");
  process.exit();
};

const DB = process.env.DATABASE_LOCAL;
mongoose.connect(DB).then(con=>{
    console.log('DB connected successfully')
})

if(process.argv[2]==='--import'){
    importUsers()
}
else if (process.argv[2]==='--delete'){
    deleteUsers()
}