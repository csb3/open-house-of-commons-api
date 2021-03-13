const parser = require('fast-xml-parser');
const fs = require('fs');
let votes = [];
const pg = require('pg');
// // Votes
fs.readFile('./xml.xml', 'utf8', (err, data) => {
  var jsonObj = parser.parse(data);
  console.log(jsonObj.ArrayOfVoteParticipant.VoteParticipant[0]);
  votes = votes.concat(jsonObj.ArrayOfVoteParticipant.VoteParticipant);
});

// Current MPs
// fs.readFile('./mps.xml', 'utf8', (err, data) => {
//   console.log(parser.parse(data).ArrayOfMemberOfParliament.MemberOfParliament[0]);
// });


// { ArrayOfMemberOfParliament:
//   { MemberOfParliament:

for (const mp_vote of votes) {

};

const insertToDatabase = function(vote) {
  const id = vote.PersonId;
  const voted_yea = vote.IsVoteYea;
  const motion_id = vote.DecisionDivisionNumber
  
};