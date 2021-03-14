require('dotenv').config();
const https = require('https');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const concat = require('concat-stream');
const db = require('../index.js');

const sqlQuery = `INSERT INTO mp_votes (mp_id, motion_id, voted_yea, voted_nay, vote_paired) VALUES ($1, $2, $3, $4, $5)`;
const motionQuery = `SELECT id FROM motions WHERE parl_num = $1 AND sess_num = $2 AND vote_num = $3;`;

parser.on('error', function(err) { console.log('Parser error', err); });

const seedingMPVotes = async function(result) {
  for (const mpVote of result.ArrayOfVoteParticipant.VoteParticipant){
    const parl_num = mpVote.ParliamentNumber[0];
    const sess_num = mpVote.SessionNumber[0];
    const vote_num = mpVote.DecisionDivisionNumber[0];
    let motion_id;

    try {
      db.query(motionQuery, [parl_num, sess_num, vote_num])
        .then(res => {
          motion_id = res.rows[0].id;

          const queryParams = [
            mpVote.PersonId[0],
            motion_id,
            mpVote.IsVoteYea[0],
            mpVote.IsVoteNay[0],
            mpVote.IsVotePaired[0]
          ];
          db.query(sqlQuery, queryParams);
        })
        .catch(err => 
          console.log(err));
    } catch(err) {
      console.log(err, 'NAY');
    }
  }
};

https.get('https://www.ourcommons.ca/members/en/votes/43/2/72/xml', function(resp) {
  resp.on('error', function(err) {
    console.log('Error while reading', err);
  });

  resp.pipe(concat(function(buffer) {
    let str = buffer.toString();
    
    parser.parseString(str, function(err, result) {
      seedingMPVotes(result);
    });
  }));
});