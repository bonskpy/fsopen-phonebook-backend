const express = require("express");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 3001;

let persons = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456",
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345",
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
  },
];

// const requestLogger = (request, response, next) => {
//   console.log("Method:", request.method);
//   console.log("Path:", request.path);
//   console.log("Body:", request.body);
//   console.log("---");
//   next(); // required so that request does not hang
// };

const unknownEndpointLogger = (request, response, next) => {
  console.log("Unknown endpoint error");
  response.status(404).send({ error: "unknown endpoint" });
  next();
};

morgan.token("request-payload", (req, res) => JSON.stringify(req.body));

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms - :request-payload ",
  ),
);
app.use(express.json());
app.use(express.static("dist"));

app.get("/api/info", (req, res) => {
  const requestTime = new Date(Date.now()).toUTCString();
  res.send(
    `<h2>Number of entries: ${persons.length}</h2>
         <p>${requestTime}</p>`,
  );
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === id);

  if (!person) {
    return res.status(404).end();
  }

  res.send(
    `<p>${person.id} : ${person.name} :  ${person.number}</p>`,
  );
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  const newName = body.name;

  if (!(body.name && body.number)) {
    return res.status(400).json({
      error: "Name and number have to be filled.",
    });
  }

  const isKnown = persons.find((person) =>
    person.name.toLowerCase() === newName.toLowerCase()
  );

  if (isKnown) {
    return res.status(400).json({ error: "Name has to be uniqe." });
  }

  const entry = {
    id: String(Math.floor(Math.random() * 100000)),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(entry);

  res.status(201).json(entry);
});

app.use(unknownEndpointLogger);

app.listen(
  PORT,
  () => console.log(`Server online: http://localhost:3001/api/persons`),
);
