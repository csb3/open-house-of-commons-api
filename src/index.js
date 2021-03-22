require('dotenv').config();

const cors = require("cors");
const express = require('express');

const app = express();

// Routes
const motions = require('./routes/motions');
const mps     = require('./routes/mps');
const users   = require('./routes/users');
const uservotes = require('./routes/uservotes');
const login   = require('./routes/login');

// Middlewares
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Route setups
app.use('/api/votes', motions);
app.use('/api/mps', mps);
app.use('/api/users', users);
app.use('/api/uservotes', uservotes);
app.use('/api/login', login);


app.listen(3001, () => console.log('Now listening on localhost:3001...'));
