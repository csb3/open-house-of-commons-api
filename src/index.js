require('dotenv').config();

const cheerio = require("cheerio");
const axios = require("axios");

const cors = require("cors");
const express = require('express');

const app = express();

// Routes
const motions = require('./routes/motions');
const mps     = require('./routes/mps');

// Middlewares 
app.use(cors());

// Route setups
app.use('/api/votes', motions);
app.use('/api/mps', mps);

app.listen(3001, () => console.log('Now listening on localhost:3001...'));
