require('dotenv').config();

// Load packages
const express = require('express');

const app = express();

// Just to check if db is working correctly.
// Get rid of these lines once there are actual quries.
const db = require('./../db/index');
db.query(`SELECT * FROM mp_votes;`, []).then(res => console.log(res.rows));

// Example code for importing route file
const route_example = require('./routes/route_example');

// localhost:4000/route_example will display 'Hello world'
app.use('/route_example', route_example);

app.listen(4000, () => console.log('Now browse to localhost:4000'));
