const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDb = async (req, res) => {
  console.log(process.env.MONGO_DB_URL);

  mongoose
    .connect(process.env.MONGO_DB_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((error) => {
      console.log(`Database connection failed due to ${error}`);
    });
};

module.exports = connectDb;
