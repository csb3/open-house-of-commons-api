const express = require('express');
const router  = express.Router();

router.get('/', (req, res) => {
  res.send('Hello world');
});

router.post('/', (req, res) => {
  // Code goes here.
});

module.exports = router;