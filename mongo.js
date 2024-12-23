const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://barhas16:${password}@cluster0.5p0xc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url);
console.log("connected to MongoDB");

const phonebookSchema = new mongoose.Schema({
  name: String,
  phone: String,
});

const Phonebook = mongoose.model("Phonebook", phonebookSchema);
console.log(process.argv.length);
console.log(process.argv);
if (process.argv.length === 3) {
  console.log("phonebook:");

  Phonebook.find({}).then((result) => {
    result.forEach((note) => {
      console.log(`${note.name} ${note.phone}`);
    });

    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  const name = process.argv[3];
  const phone = process.argv[4];

  const note = new Phonebook({
    name: name,
    phone: phone,
  });

  console.log(note);

  note.save().then((result) => {
    console.log(`added ${name} number: ${phone} to phonebook`);
    mongoose.connection.close();
  });
}
