const { db } = require('../index');

const seedOneVote = async function(parsedXML) {
  const mp_votes = parsedXML.ArrayOfVoteParticipant.VoteParticipant;
  const motionQuery = 'SELECT id FROM motions WHERE parl_num = $1 AND sess_num = $2 AND vote_num = $3;';
  const mpVoteQuery = 'INSERT INTO mp_votes (mp_id, motion_id, voted_yea, voted_nay, vote_paired) VALUES ($1, $2, $3, $4, $5)';

  for await (const mpVote of mp_votes) {
    const parl_num = mpVote.ParliamentNumber[0];
    const sess_num = mpVote.SessionNumber[0];
    const vote_num = mpVote.DecisionDivisionNumber[0];

    await db.query(motionQuery, [parl_num, sess_num, vote_num])
      .then(res => {
        const queryParams = [
          mpVote.PersonId[0],
          res.rows[0].id,
          mpVote.IsVoteYea[0],
          mpVote.IsVoteNay[0],
          mpVote.IsVotePaired[0]
        ];
        db.query(mpVoteQuery, queryParams);
      })
      .catch(err => console.log(err));
  }
};

// maxVoteNum is a auto generated array with numbers starting from 0. That is why it is vote + 1
// You can set the maximum number of vote sessions by changing the value in db/parsing/index.js
// For different parliament number and session number, pass the desired value in db/parsing/index.js
const seedMpVotesTable = async function(parliamentNum, sessionNum, maxVoteNum, XMLparser) {
  for await (const vote of maxVoteNum) {
    const url = `https://www.ourcommons.ca/members/en/votes/${parliamentNum}/${sessionNum}/${vote + 1}/xml`;

    XMLparser(url, seedOneVote);
  }
};

module.exports = {
  seedMpVotesTable,
};