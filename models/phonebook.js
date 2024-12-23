const mongoose = require("mongoose");
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

const phonebookSchema = new mongoose.Schema({
  name: String,
  phone: String,
});

const Phonebook = mongoose.model("Phonebook", phonebookSchema);

phonebookSchema.set("toJSON", {
  transform: (document, returnObject) => {
    returnObject.id = returnObject._id.toString();
    delete returnObject._id;
    delete returnObject.__v;
  },
});

module.exports = Phonebook;
