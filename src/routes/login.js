const express = require('express');
const router  = express.Router();

const { db } = require('./../../db/index');

router.get('/:id', (req, res) => {
  db.query(`SELECT email, id FROM users WHERE id = $1;`, [req.params.id])
    .then(
      response => res.send(response.rows)
    );
});

module.exports = router;