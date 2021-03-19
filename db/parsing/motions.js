const { db } = require('./../index');
const { getXMLfile, webscrape } = require('./helpers');

// Find db/parsing/constituencies.js for explanation with the same logic.
const seedTable = function(motions, webData) {
  const motion = motions[0];
  const singleWebData = webData[0];
  const queryString = 'INSERT INTO motions (vote_num, parl_num, sess_num, bill_num, date, result, summary, mp_id, bill_url, sitting_num, motion_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)';
  const queryParams = [
    motion.DecisionDivisionNumber[0],
    motion.ParliamentNumber[0],
    motion.SessionNumber[0],
    motion.BillNumberCode[0],
    motion.DecisionEventDateTime[0],
    motion.DecisionResultName[0],
    motion.DecisionDivisionSubject[0], 
    singleWebData.sponsorNum,
    singleWebData.billUrl,
    singleWebData.sittingNum,
    `https://www.ourcommons.ca/members/en/votes/43/2/${motion.DecisionDivisionNumber[0]}`
  ];
  
  if (motions.length > 1) {
    return new Promise((resolve, reject) =>
      resolve(
        db.query(queryString, queryParams)
          .then(() => seedTable(motions.slice(1), webData.slice(1)))
      )
    );
  }

  return new Promise((resolve, reject) =>
    resolve(
      db.query(queryString, queryParams)
    )
  );
};

const getAllWebData = function(webData, motions, index) {
  if (index < motions.length - 1) {
    const motion = motions[index];

    return new Promise((resolve, reject) => 
      resolve(
        webscrape(motion.DecisionDivisionNumber[0])
          .then(result => {
            console.log(`It is running ${motion.DecisionDivisionNumber[0]}`);
            webData.push(result);
          })
          .then(() => getAllWebData(webData, motions, index + 1))
      )
    )
  }

  const motion = motions[index];

  return new Promise((resolve, reject) => {
    resolve(
      webscrape(motion.DecisionDivisionNumber[0])
        .then(result => webData.push(result))
        .then(() => seedTable(motions, webData))
    )
  });
};

const processXML = function(parsedXML) {
  const motions = parsedXML.ArrayOfVote.Vote;
  const webData = [];

  return new Promise((resolve, reject) =>
    resolve(
      getAllWebData(webData, motions, 0)
    )
  );
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