const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const fs =require("fs");
const Tour=require("../../models/tourModel")
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  // .connect(process.env.DATABASE_LOCAL, {
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('DB connect success');
  });
  
  const tours=JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`,"utf-8"));

  const importData=async()=>{
      try{
          await Tour.create(tours);
          console.log("data successful loaded")
      }
      catch(err){
          console.log(err);
      }
      process.exit()
  }
  const deletetData=async()=>{
    try{
        await Tour.deleteMany();
        console.log("data success delete");
    }
    catch(err){
        console.log(err);
    }
    process.exit();
}
if(process.argv[2]==="--import"){
    importData();
}else if(process.argv[2]==="--delete"){
    deletetData();
}
