const mongoose = require("mongoose");
const fs = require("fs");
const dotenv = require("dotenv");
const Tour = require("../../models/ToursModel");
dotenv.config({ path: "./config.env" });

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`));

const DB = process.env.DATABASE_LOCAL;
mongoose.connect(DB).then((con) => console.log("DB connected successfully"));

const importData = async () => {
  await Tour.create(tours);
  console.log("tours imported successfully");
  process.exit();
};
const deleteData = async () => {
  await Tour.deleteMany();
  console.log("tours deleted successfully");
  process.exit();
};
if (process.argv[2] === "--import") {
    try{

        importData();
        
        
    }catch(err){
        console.log(err)
    }
}
else if (process.argv[2] === "--delete") {
  deleteData();
  
}
