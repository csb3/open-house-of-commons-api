const express = require('express');
const router  = express.Router();

const { db } = require('./../../db/index');

router.get('/', (req, res) => {
  db.query(`SELECT * FROM motions;`, []).then(
    response => res.send(response.rows)
  );
});

router.get('/:id', (req, res) => {
  db.query(`SELECT * FROM motions WHERE id = $1`, [req.params.id])
    .then(result=> {
      if (result.rows.length !== 0) {
        res.send(result.rows);
      } else {
        res.send('error');
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

// router.post('/', (req, res) => {
//   // Code goes here.
// });

module.exports = router;