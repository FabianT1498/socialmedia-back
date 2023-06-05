import mongoose from "mongoose";

const { DATABASE_URL } = process.env;

const connect = async () => {
  // Connecting to the database
  try{
    await mongoose.connect(DATABASE_URL || "")
    console.log("Successfully connected to database");
  } catch(err){
    console.log("database connection failed. exiting now...");
    throw err
  }
};

export default connect;
