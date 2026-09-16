const express = require("express");
const morgan = require("morgan");
const Person = require("./modules/person");
const { default: mongoose } = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3001;

const unknownEndpointLogger = (request, response, next) => {
  console.log("Unknown endpoint error");
  response.status(404).send({ error: "unknown endpoint" });
  next();
};

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformed id" });
  }

  next(error);
};

morgan.token("request-payload", (req, res) => JSON.stringify(req.body));

app.use(express.json());
app.use(express.static("dist"));
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms - :request-payload ",
    { skip: (req, res) => req.originalUrl.startsWith("/.well-known/") },
  ),
);

app.get("/api/info", (req, res) => {
  const requestTime = new Date(Date.now()).toUTCString();
  Person.countDocuments({}).then((count) => {
    res.send(
      `<h2>Number of entries: ${count}</h2>
         <p>${requestTime}</p>`,
    );
  });
});

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((allPersons) => {
      res.json(allPersons);
    })
    .catch((err) => next(err));
});

app.get("/api/persons/:id", (req, res, next) => {
  const entryId = req.params.id;

  Person.findById(entryId)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        return res.status(404).end();
      }
    })
    .catch((err) => next(err));
});

app.delete("/api/persons/:id", (req, res, next) => {
  const entryId = req.params.id;
  Person.findByIdAndDelete(entryId)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  console.log(body)

  if (!(body.name && body.number)) {
    return res.status(400).json({
      error: "Name and number have to be filled.",
    });
  }

  const newPerson = new Person({ name: body.name, number: body.number });

  // const isKnown = persons.find((person) =>
  //   person.name.toLowerCase() === newName.toLowerCase()
  // );

  // if (isKnown) {
  //   return res.status(400).json({ error: "Name has to be uniqe." });
  // }

  newPerson
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      console.log("error saving new entry:", err);
    });
});

app.listen(PORT, () => console.log(`server online`));

app.use(unknownEndpointLogger);
app.use(errorHandler);
