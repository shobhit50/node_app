const mongoose = require('mongoose');

const dbURI = "mongodb://localhost:27017/url-shortener";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Database connected!"))
    .catch(err => console.log("Database connection error: ", err));

module.exports = mongoose;

