require("colors");
require("dotenv").config();
const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN);
    console.log("Database connection succesfully 🙏".green);
  } catch (error) {
    console.log(error);
    throw new Error("Error when connectin to de database".red);
  }
};

module.exports = dbConnection;

// {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       useCreateIndex: true,
//       useFindAndModify: false,
//     }