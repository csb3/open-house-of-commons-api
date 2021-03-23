const express = require('express');
const router  = express.Router();

const { db } = require('./../../db/index');

router.get('/', (req, res) => {
  db.query(`SELECT * from constituencies WHERE name like '%$1%' OR location LIKE '%$2%';`, [req.query.term, req.query.term])
    .then(
      response => {
        console.log(response.rows);
        res.send(response.rows);
      }
    );
});

module.exports = router;