require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
app.use(cors())

const morgan = require('morgan');
app.use(morgan('dev'));
app.use(express.json())

app.use((req, res, next) => {
    console.log('<___Body Logger START___>');
    console.log(req.body);
    console.log('<___Body Logger END___>');
    
    next();
})

const apiRouter = require("./api");
app.use('/api', apiRouter);

const client = require('./db/client');
client.connect();

// Setup your Middleware and API Router here

module.exports = app;
