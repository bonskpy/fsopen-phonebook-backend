/*
phonebook cli
*/

const dotenv = require('dotenv')
const mongoose = require("mongoose");
const Person = require('./modules/person')

dotenv.config()

let testPersons = [
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

    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
  },
];

if (!(process.argv.length !== 4 || process.argv.length !== 2)) {
    console.log("phonebook cli");
    console.log("usage: node mongo.js <name> <number>   - add one entry");
    console.log(".      node mongo.js                   - list all entries");
    process.exit(1);
}

const contact_name = process.argv[2];
const phone_number = process.argv[3];


if (process.argv.length === 2) {
    Person.find({}).then((results) => {
        console.log("phonebook:");
        results.forEach((entry) => {
            console.log(entry.name, entry.number);
        });
        mongoose.connection.close();
        process.exit(0);
    }).catch( (err) => {
        console.error('something went wrong...', err)
        mongoose.connection.close();
        process.exit(1);

    })
}

if (process.argv.length === 4) {
    const entry = new Person(
        {
            name: contact_name,
            number: phone_number,
        },
    );

    console.log(entry)

    entry.save().then((response) => {
        console.log("entry added:", response);
        mongoose.connection.close();
        process.exit(0);
    }).catch( (err) => {
        console.error('something went wrong...', err)
        mongoose.connection.close();
        process.exit(1);        
    })
}
