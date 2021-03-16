require('dotenv').config();

// Load packages
const express = require('express');

const app = express();

// Just to check if db is working correctly.
// Get rid of these lines once there are actual quries.
const db = require('./../db/index');
db.query(`SELECT * FROM motions;`, []).then(res => console.log(res.rows));

// Example code for importing route file
const motions = require('./routes/motions');

// localhost:3001/route_example will display 'Hello world'
app.use('/motions', motions);

app.listen(3001, () => console.log('Now browse to localhost:3001'));
