require('dotenv').config();
const https = require('https');
const xml2js = require('xml2js');

const parser = new xml2js.Parser();
const concat = require('concat-stream');
const db = require('../index.js');

const sqlQuery = 'INSERT INTO mps (id, first_name, last_name, party_name, constituency_id) VALUES ($1, $2, $3, $4, $5)';
const mpQuery = 'SELECT mp_id FROM mp_votes GROUP BY mp_id';
const constQuery = 'SELECT id FROM constituencies WHERE name=$1;';

parser.on('error', (err) => { console.log('Parser error', err); });

const asyncLoop = async function(mpIdArray) {
  for (const mpId of mpIdArray) {
    try {

      https.get(`https://www.ourcommons.ca/members/en/${mpId.mp_id}/xml`, function(resp) {
        resp.on('error', function(err) {
          console.log('Error while reading', err);
        });
      
        resp.pipe(concat(function(buffer) {
          let str = buffer.toString();
      
          parser.parseString(str, function(err, result) {
            const findByMP = result.Profile.MemberOfParliamentRole[0]
            const constParams = [findByMP.ConstituencyName[0]];
      
            db.query(constQuery, constParams)
              .then((res) => {
      
                const mpParams = [
                  mpId.mp_id,
                  findByMP.PersonOfficialFirstName[0],
                  findByMP.PersonOfficialLastName[0],
                  findByMP.CaucusShortName[0],
                  res.rows[0].id
                ];
      
                db.query(sqlQuery, mpParams)
              })
              .catch(err => console.log(err));
          });
        }));
      });
    } catch(error) {
      console.log(error, "NAY");
    }
  }
};

const seedingMPs = function() {
  db.query(mpQuery)
    .then((res) => asyncLoop(res.rows))
    .catch(err => console.log(err));
};

seedingMPs();