const express = require('express');
const router  = express.Router();

const { db } = require('./../../db/index');

router.get('/', (req, res) => {
  db.query(`SELECT * FROM motions;`, []).then(
    response => res.send(response.rows)
  );
});

// router.post('/', (req, res) => {
//   // Code goes here.
// });

module.exports = router;