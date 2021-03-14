const { db } = require('./../index');

const seedMotionsTable = async function(parsedXML) {
  const motions = parsedXML.ArrayOfVote.Vote;
  const queryString = 'INSERT INTO motions (vote_num, parl_num, sess_num, bill_num, date, result, summary) VALUES ($1, $2, $3, $4, $5, $6, $7)';

  for await (const motion of motions){
    const queryParams = [
      motion.DecisionDivisionNumber[0],
      motion.ParliamentNumber[0],
      motion.SessionNumber[0],
      motion.BillNumberCode[0],
      motion.DecisionEventDateTime[0],
      motion.DecisionResultName[0],
      motion.DecisionDivisionSubject[0]
    ];

    await db.query(queryString, queryParams);
  }
};

module.exports = {
  seedMotionsTable,
};