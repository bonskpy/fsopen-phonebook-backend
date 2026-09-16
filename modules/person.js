const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const uri = process.env.MONGODB_URI;

mongoose.set('strictQuery', false)

console.log("connecting to the database");
mongoose.connect(uri, { family: 4, dbName: "phonebook" })
    .then((result) => {
        console.log("connected");
    }).catch((err) => {
        console.error("failed: ", err);
    });

const personSchema = mongoose.Schema(
    {name: String, number: String}
)

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = document._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)