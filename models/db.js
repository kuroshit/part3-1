const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;
mongoose
  .connect(url)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

module.exports = mongoose;