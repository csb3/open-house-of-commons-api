require('dotenv').config();

// Load packages
const express = require('express');

const app = express();

const motions = require('./routes/motions');
const mp_votes = require('./routes/mp_votes');

app.use('/motions', motions);
app.use('/mp_votes', mp_votes);

app.listen(3001, () => console.log('Now listening on localhost:3001...'));
