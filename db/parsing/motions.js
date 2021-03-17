const { db } = require('./../index');
const { getXMLfile } = require('./helpers');

// Find db/parsing/constituencies.js for explanation with the same logic.
const seedTable = function(motions) {
  const motion = motions[0];
  const queryString = 'INSERT INTO motions (vote_num, parl_num, sess_num, bill_num, date, result, summary) VALUES ($1, $2, $3, $4, $5, $6, $7)';
  const queryParams = [
    motion.DecisionDivisionNumber[0],
    motion.ParliamentNumber[0],
    motion.SessionNumber[0],
    motion.BillNumberCode[0],
    motion.DecisionEventDateTime[0],
    motion.DecisionResultName[0],
    motion.DecisionDivisionSubject[0]
  ];
  if (motions.length > 1) {
    return new Promise((resolve, reject) =>
      resolve(
        db.query(queryString, queryParams)
          .then(() => seedTable(motions.slice(1)))
      )
    );
  }

  return new Promise((resolve, reject) =>
    resolve(
      db.query(queryString, queryParams)
    )
  );
};

const processXML = function(parsedXML) {
  const motions = parsedXML.ArrayOfVote.Vote;

  return new Promise((resolve, reject) => resolve(seedTable(motions)));
};

const motions = function() {
  const url = 'https://www.ourcommons.ca/members/en/votes/xml';

  console.log('Starting for motions...');

  return new Promise((resolve, reject) =>
    resolve(
      getXMLfile(url)
        .then(result => processXML(result))
        .then(() => console.log('Completed: motions table'))
    )
  );
};

module.exports = {
  motions,
};