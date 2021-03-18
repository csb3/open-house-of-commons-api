const { db } = require('../index');
const { getXMLfile } = require('./helpers');

/**
 * Execution flow
 * get motions data from motions table (getAllMotions)
 * loop through all the motions (getAllXMLfiles)
 * for each motion, fetch XML and parse it to array of votes (getXMLfile -> processXML)
 * store all the votes to mp_votes table (nested recursive loop) (seedTable)
 * get the next motion  (getAllXMLfiles second call)
 * repeat the task until all the motions are fetched and stored
 */

const seedTable = function(mp_votes, motionId) {
  const mp_vote = mp_votes[0];
  const queryString = 'INSERT INTO mp_votes (mp_id, motion_id, voted_yea, voted_nay, vote_paired, party_name) VALUES ($1, $2, $3, $4, $5, $6) RETURNING motion_id;';
  const queryParams = [
    mp_vote.PersonId[0],
    motionId,
    mp_vote.IsVoteYea[0],
    mp_vote.IsVoteNay[0],
    mp_vote.IsVotePaired[0],
    mp_vote.CaucusShortName[0]
  ];

  // motionId can't reach down to the promise chain.
  // db.query will return the motion_id after saving the data so that the next call can use it.
  if (mp_votes.length > 1) {
    return new Promise((resolve, reject) =>
      resolve(
        db.query(queryString, queryParams)
          .then(res => seedTable(mp_votes.slice(1), res.rows[0].motion_id))
      )
    );
  }

  // This is the last call for the votes in one motion
  return new Promise((resolve, reject) =>
    resolve(
      db.query(queryString, queryParams)
        .then(() => console.log(`Completed: Vote No. ${mp_vote.DecisionDivisionNumber[0]}`))
    )
  );
};

const processXML = function(parsedXML, motionId) {
  const mp_votes = parsedXML.ArrayOfVoteParticipant.VoteParticipant;
  
  return new Promise((resolve, reject) => resolve(seedTable(mp_votes, motionId)));
};

const getAllXMLfiles = function(motions) {
  const motion = motions[0];
  const parlNum = motion.parl_num;
  const sessNum = motion.sess_num;
  const voteNum = motion.vote_num;
  const motionId = motion.id;
  const url = `https://www.ourcommons.ca/members/en/votes/${parlNum}/${sessNum}/${voteNum}/xml`;

  if (motions.length > 1) {
    return new Promise((resolve, reject) =>
      resolve(
        getXMLfile(url)
          .then(result => processXML(result, motionId))
          .then(() => getAllXMLfiles(motions.slice(1)))
      )
    );
  }

  // This is the last call for the motions array, resolves mp_votes()
  return new Promise((resolve, reject) =>
    resolve(
      getXMLfile(url)
        .then(result => processXML(result, motionId))
    )
  );
};

// mp_votes table has reference to motion_id.
const getAllMotions = function() {
  const queryString = 'SELECT * FROM motions;';

  return db.query(queryString).then(res => res.rows);
};
    
const mp_votes = function() {
  console.log('Starting for mp_votes...');

  return new Promise((resolve, reject) =>
    resolve(
      getAllMotions()
        .then(motions => getAllXMLfiles(motions))
        .then(() => console.log('Completed: mp_votes table'))
    )
  );
};

module.exports = {
  mp_votes,
};