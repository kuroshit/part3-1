const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);

const mongoURI = process.env.MONGODB_URI;

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

noteSchema.set("toJSON", {
  transform: (document, returnObject) => {
    returnObject.id = returnObject._id.toString();
    delete returnObject._id;
    delete returnObject.__v;
  },
});

module.exports = Note;