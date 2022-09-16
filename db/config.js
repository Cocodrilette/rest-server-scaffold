require("colors");
require("dotenv").config();
const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN);
    console.log("Database connection succesfully 🙏".green);
  } catch (error) {
    console.log(error);
    throw new Error("Error to connect the database".red);
  }
};

module.exports = dbConnection;
