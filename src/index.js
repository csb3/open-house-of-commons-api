require('dotenv').config();

const cors = require("cors");
const express = require('express');

const app = express();

// Routes
const motions = require('./routes/motions');
const mps     = require('./routes/mps');
const login = require('./routes/login');

// Middlewares
app.use(cors());

// Route setups
app.use('/api/votes', motions);
app.use('/api/mps', mps);
app.use('/api/login', login);

app.listen(3001, () => console.log('Now listening on localhost:3001...'));
