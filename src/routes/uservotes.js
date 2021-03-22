const express = require('express');
const router  = express.Router();

const { db } = require('../../db/index');

router.get('/', (req, res) => {
  db.query(`SELECT * FROM user_votes WHERE user_id=$1 AND motion_id=$2;`, [req.params.id, req.params.motion]).then(
    response => {
      res.send(response.rows)
    }
  );
});

module.exports = router;