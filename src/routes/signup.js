const express = require('express');
const router  = express.Router();
const { db } = require('./../../db/index');


router.post('/', (req, res) => {
  console.log("Req.body: ", req.body);
  db.query(`INSERT INTO users (email, password_digest) VALUES ($1, $2) RETURNING email`, [req.body.email, req.body.password])
    .then((result) => {
      console.log("result in signup api", result);
      res.send(result.rows);
    });
});

module.exports = router;