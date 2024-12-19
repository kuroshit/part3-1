const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
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

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true,
  },
  {
    id: "2",
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false,
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true,
  },
];

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

app.post("/api/notes", (req, res) => {
  const body = req.body;

  if (!body.content) {
    return res.status(400).json({
      error: "content missing",
    });
  }

  const note = {
    id: String(notes.length + 1),
    content: body.content,
    date: new Date(),
    important: body.important || false,
  };

  notes = notes.concat(note);

  res.json(note);
});

app.put('/api/notes/:id', (req, res) => {
  const id = req.params.id
  const body = req.body

  console.log(body)

  notes = notes.map(note => note.id !== id ? note : body)

  res.json(body)
})

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
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((note) => note.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
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
  if (validatePerson(body)) {
    return res.status(400).json({ error: "Bad Request" });
  }

  const person = {
    id: Math.random().toString(36),
    name: body.name,
    number: body.number,
  };

  console.log(person);

  persons = persons.concat(person);

  res.json(person);
});

app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((note) => note.id !== id);
  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
