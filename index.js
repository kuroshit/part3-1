const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const Note = require("./models/note");
const Phonebook = require("./models/phonebook");
const app = express();

morgan.token("body", (req) => JSON.stringify(req.body));

app.use(express.static("dist"));
app.use(cors());
app.use(express.json());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :body"
    // {
    //   skip: (req) => req.method !== "POST",
    // }
  )
);

app.get("/api/notes", (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes);
  });
});

app.post("/api/notes", (req, res) => {
  const body = req.body;

  if (!body.content) {
    return res.status(400).json({
      error: "content missing",
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  note.save().then((savedNote) => {
    res.json(savedNote);
  });
});

app.put("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  const body = req.body;

  notes = notes.map((note) => (note.id !== id ? note : body));

  res.json(body);
});

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/info", (req, res) => {
  const date = new Date();
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`
  );
});

app.get("/api/persons", (req, res) => {
  Phonebook.find({}).then((persons) => {
    if (persons) {
      res.json(persons);
    } else {
      res.status(404).end();
    }
  });
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  Phonebook.findById(id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

const validatePerson = (person) => {
  if (!person.name || !person.number) {
    return true;
  }

  if (persons.find((p) => p.name === person.name)) {
    return true;
  }

  return false;
};

app.post("/api/persons", (req, res) => {
  const body = req.body;
  // if (validatePerson(body)) {
  //   return res.status(400).json({ error: "Bad Request" });
  // }

  const person = new Phonebook({
    name: body.name,
    phone: body.phone,
  });

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((note) => note.id !== id);
  res.status(204).end();
});

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
