const mongoose = require('mongoose');
const URI = require('../client/config/');

//Connect to MongoDB 
mongoose.connect(process.env.MONGODB_URI || URI);

// Connect our backend code with the database
mongoose.connect(
    URI, 
    { useNewURLParser: true }
);

// CONNECTION EVENTS
mongoose.connection.on('connected', () => console.log("Established mongoose default connection"));
// IF Error
mongoose.connection.on('error',(err) => console.log('Mongoose default connection error: ' + err)); 
// When the connection is disconnected
mongoose.connection.on('disconnected', () => console.log('Mongoose default connection disconnected'));