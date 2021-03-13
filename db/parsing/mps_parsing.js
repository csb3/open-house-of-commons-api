require('dotenv').config();
const https = require('https');
const xml2js = require('xml2js');

const parser = new xml2js.Parser();
const concat = require('concat-stream');
const db = require('../index.js');

const sqlQuery = 'INSERT INTO mps (id, first_name, last_name, party_id, constituency_id) VALUES ($1, $2, $3, $4, $5)';
const mpQuery = 'SELECT mp_id FROM mp_votes GROUP BY mp_id';
const constQuery = 'SELECT const_id FROM constituencies WHERE name=$1;';

parser.on('error', (err) => { console.log('Parser error', err); });

const seedingMPs = function () {
  db.query(mpQuery)
    .then((res) => {
      res.rows.forEach((row) => {
        const mpId = row.mp_id;

        https.get(`https://www.ourcommons.ca/Members/en/${mpId}/xml`, (resp) => {
          resp.on('error', (err) => {
            console.log('Error while reading', err);
          });

          resp.pipe(concat((buffer) => {
            const str = buffer.toString();

            parser.parseString(str, (err, result) => {
              const constParams = [result.MemberOfParliamentRole.ConstituencyName];
              db.query(constQuery, constParams)
                .then((res2) => {
                  console.log(res2.rows);
                  const mpParams = [
                    mpId,
                    result.MemberOfParliamentRole.PersonOfficialFirstName[0],
                    result.MemberOfParliamentRole.PersonOfficialLastName[0],
                    result.MemberOfParliamentRole.CaucusShortName[0],
                    res2.rows[0].id,
                  ];
                  db.query(sqlQuery, mpParams);
                });
            });
          }));
        });
      });
    })
    .catch(err => console.log(err));
};

seedingMPs();

// https.get('https://www.ourcommons.ca/members/en/search/xml', function(resp) {
//   resp.on('error', function(err) {
//     console.log('Error while reading', err);
//   });

//   resp.pipe(concat(function(buffer) {
//     let str = buffer.toString();

//     parser.parseString(str, function(err, result) {
//       seedingMPs(result);
//     });
//   }));
// });
