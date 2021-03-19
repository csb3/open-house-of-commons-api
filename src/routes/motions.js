const express = require('express');
const router  = express.Router();

const cheerio = require("cheerio");
const axios = require("axios");

const { db } = require('./../../db/index');

router.get('/', (req, res) => {
  db.query(`SELECT * FROM motions;`, []).then(
    response => res.send(response.rows)
  );
});

router.get('/:id', (req, res) => {
  const responseObj = {};
  db.query(`SELECT * FROM motions WHERE id = $1`, [req.params.id])
    .then(result=> {
      if (result.rows.length !== 0) {
        responseObj.motionInfo = result.rows;
      } else {
        res.send('error');
      }
    })
    .then(() => {
      return db.query(`SELECT * FROM mp_votes WHERE motion_id = $1`, [req.params.id])
        .then(response => {
          responseObj.voteInfo = response.rows;
        });
    })
    .then(() => {
      return db.query(`SELECT
        (SELECT count(*) from user_votes WHERE voted_yea = true AND motion_id = $1) as YesVotes,
        (SELECT count(*) from user_votes WHERE voted_nay = true AND motion_id = $2) as NoVotes`, [req.params.id, req.params.id])
        .then(response => {
          responseObj.userVotes = response.rows;
          res.send(responseObj);
        });
    })
    .then(() => {
      async function fetchHTML(url) {
        const { data } = await axios.get(url)
        return cheerio.load(data)
      }

      async function webscape() {
        const $ = await fetchHTML(`https://www.ourcommons.ca/members/en/votes/43/2/${responseObj.motionInfo[0].vote_num}`);

        const sponsorNum = $("a.ce-mip-mp-tile")["0"].attribs.href.replace(/\D/g,'');
        //console.log(sponsorNum);

        const sittingNum = $("div.mip-vote-title-section").text().replace(/\s+/g,' ').trim().split(" ")[9];
        //console.log(sittingNum);

        const motionLink = responseObj.motionInfo[0].vote_num;

        if ($("div.ce-mip-vote-block").children('p').eq(3).length) {
          const billLink = $("div.ce-mip-vote-block").children('p').eq(3).children('a').eq(1)["0"].attribs.href;
          //console.log(billLink);
        } else {
          const billLink = "";
        }
      }
      webscape();
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });

});

module.exports = router;