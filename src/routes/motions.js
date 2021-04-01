const { response } = require("express");
const express = require("express");
const router = express.Router();

const { db } = require('./../../db/index');

router.get("/", (req, res) => {
  db.query(`SELECT * FROM motions;`, []).then((response) =>
    res.send(response.rows)
  );
});

router.get("/:id", (req, res) => {
  const responseObj = {};

  db.query(`
    SELECT motions.*, constituencies.name, mps.first_name, mps.last_name, constituencies.location, mps.party_name FROM motions 
    INNER JOIN mps ON mps.id = motions.mp_id
    INNER JOIN constituencies ON constituencies.id = mps.constituency_id
    WHERE motions.id = $1`,
  [req.params.id]
  )
    .then(result=> {
      if (result.rows.length !== 0) {
        responseObj.motionInfo = result.rows;
      } else {
        res.send("error");
      }
    })
    .then(() => {
      return db
        .query(
          `SELECT *, constituencies.* FROM mps
          FULL JOIN (SELECT voted_yea, voted_nay, vote_paired, mp_id from mp_votes WHERE motion_id = $1) as Foo on mps.id = foo.mp_id
          LEFT JOIN constituencies on mps.constituency_id = constituencies.id
          ORDER BY mps.party_name, mps.last_name;`,
          [req.params.id]
        )
        .then((response) => {
          responseObj.voteInfo = response.rows;
        });
    })
    .then(() => {
      return db.query(`
        SELECT email, constituency_id FROM users
        WHERE id = $1`, [1]
      )
        .then(response => {
          responseObj.userInfo = response.rows;
        });
    })
    .then(() => {
      return db.query(`
        SELECT * FROM user_votes WHERE motion_id=$1 AND user_id=$2`, [req.params.id, req.query.userId]
      )
        .then(response => {
          responseObj.votes = response.rows;
        });
    })
    .then(() => {
      return db.query(`SELECT
        (SELECT count(*) from user_votes WHERE voted_yea = true AND motion_id = $1) as YesVotes,
        (SELECT count(*) from user_votes WHERE voted_nay = true AND motion_id = $2) as NoVotes`,
      [req.params.id, req.params.id]
      ).then((response) => {
        responseObj.userVotes = response.rows;
        res.send(responseObj);
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// 2 "routes"
// Add --> voted_yea, voted_nay
// Delete entire motion vote row

// SELECT * FROM user_votes WHERE motion_id=$1 AND user_id=$2`, [req.params.id, ≈]

//NSERT INTO user_votes (user_id, motion_id, voted_yea, voted_nay) VALUES (49, 35, false, true);

router.post('/:id', (req, res) => {
  console.log("req.body: ", req.body);
  const responseObj = {};
  if (req.body.userVoteId) {
    db.query('DELETE FROM user_votes WHERE id = $1', [req.body.userVoteId])
      .then((result) => responseObj.votes = result.rows)
      .then(() => {
        return db.query(`SELECT
          (SELECT count(*) from user_votes WHERE voted_yea = true AND motion_id = $1) as YesVotes,
          (SELECT count(*) from user_votes WHERE voted_nay = true AND motion_id = $2) as NoVotes`,
        [req.params.id, req.params.id]
        ).then((response) => {
          responseObj.userVotes = response.rows;
          res.send(responseObj);
        });
      })
      .catch(err => console.log(err));
  }
  
  if (req.body.userId) {
    const params = [req.body.userId, req.params.id, req.body.yea, req.body.nay];
    db.query('INSERT INTO user_votes (user_id, motion_id, voted_yea, voted_nay) VALUES ($1, $2, $3, $4) RETURNING *', params)
      .then((result => responseObj.votes = result.rows))
      .then(() => {
        return db.query(`SELECT
          (SELECT count(*) from user_votes WHERE voted_yea = true AND motion_id = $1) as YesVotes,
          (SELECT count(*) from user_votes WHERE voted_nay = true AND motion_id = $2) as NoVotes`,
        [req.params.id, req.params.id]
        ).then((response) => {
          responseObj.userVotes = response.rows;
          res.send(responseObj);
        });
      })
      .catch(err => console.log(err));
    console.log("This is an insert query for with these params: ", params);
  }
});

module.exports = router;