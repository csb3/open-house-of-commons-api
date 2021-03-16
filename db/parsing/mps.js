const { db } = require('./../index');
const { getXMLfile } = require('./helpers');

/**
 * Execution flow
 * Get all PersonId from mp_votes table
 * Loop through ids
 * Fetch XML files with the url that is associated with id
 * Get constituency_id from constituencies table
 * Store the data to db
 * Repeat the process
 */

const seedTable = function(mp, constituencyId, mpId) {
  const queryString = 'INSERT INTO mps (id, first_name, last_name, party_name, constituency_id) VALUES ($1, $2, $3, $4, $5);';
  const queryParams = [
    mpId,
    mp.PersonOfficialFirstName[0],
    mp.PersonOfficialLastName[0],
    mp.CaucusShortName[0],
    constituencyId
  ];

  return db.query(queryString, queryParams);
};

// To reference their constituencies.
const getConstituency = function(constituencyName) {
  const queryString = 'SELECT id FROM constituencies WHERE name=$1;';

  // Returns id for constituency that has the matching name.
  return db.query(queryString, [constituencyName]).then(res => res.rows[0].id);
};

const processXML = function(parsedXML, mpId) {
  const mp = parsedXML.Profile.MemberOfParliamentRole[0];
  const constituencyName = mp.ConstituencyName[0];
  
  return new Promise((resolve, reject) =>
    resolve(
      getConstituency(constituencyName)
        .then((constituencyId) => seedTable(mp, constituencyId, mpId))
    )
  );
};

const getAllXMLfiles = function(mps) {
  const mp = mps[0];
  const url = `https://www.ourcommons.ca/members/en/${mp.mp_id}/xml`;

  if (mps.length > 1) {
    return new Promise((resolve, reject) =>
      resolve(
        getXMLfile(url)
          .then(result => processXML(result, mp.mp_id))
          .then(() => {
            console.log(`Completed for mp_id ${mp.mp_id}`)
            return getAllXMLfiles(mps.slice(1));
          })
      )
    );
  }

  return new Promise((resolve, reject) =>
    resolve(
      getXMLfile(url)
        .then(result => processXML(result, mp.mp_id))
    )
  );
};

const getAllPersonIds = function() {
  const queryString = 'SELECT mp_id FROM mp_votes GROUP BY mp_id;';

  return db.query(queryString);
};

const mps = function() {
  console.log('Starting mps...');

  return new Promise((resolve, reject) =>
    resolve(
      getAllPersonIds()
        .then(mps => {
          // Include the speaker's ID
          mps.rows.push({ mp_id: 25452 });

          return getAllXMLfiles(mps.rows);
        })
        .then(() => {
          console.log('Completed: mps table')
          db.end();
        })
    )
  );
};

module.exports = {
  mps,
};
