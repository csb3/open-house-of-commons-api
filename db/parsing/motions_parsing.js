require('dotenv').config();
const https = require('https');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const concat = require('concat-stream');
const db = require('../index.js'); 

// TO-DO: parse sitting num 

// vote_num, parl_num, sess_num, sitting_num, bill_num, date, result, summary
const sqlQuery = `INSERT INTO motions (vote_num, parl_num, sess_num, bill_num, date, result, summary) VALUES ($1, $2, $3, $4, $5, $6, $7)`;

parser.on('error', function(err) { console.log('Parser error', err); });

const seedingMotions = async function(result) {
  for (const motion of result.ArrayOfVote.Vote){
    const queryParams = [
      motion.DecisionDivisionNumber[0],
      motion.ParliamentNumber[0],
      motion.SessionNumber[0],
      motion.BillNumberCode[0],
      motion.DecisionEventDateTime[0],
      motion.DecisionResultName[0],
      motion.DecisionDivisionSubject[0]
    ];

    try {
      db.query(sqlQuery, queryParams);
    } catch(error) {
      console.log(error, "NAY");
    }
  }
};

https.get('https://www.ourcommons.ca/members/en/votes/xml', function(resp) {
  resp.on('error', function(err) {
    console.log('Error while reading', err);
  });

  resp.pipe(concat(function(buffer) {
    let str = buffer.toString();
    
    parser.parseString(str, function(err, result) {
      seedingMotions(result);
    });
  }));
});