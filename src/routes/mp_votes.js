const express = require('express');
const router  = express.Router();

const { db } = require('./../../db/index');

router.get('/', (req, res) => {
  db.query(`SELECT * FROM mp_votes;`, []).then(
    response => res.send(response.rows)
  );
});

module.exports = router;