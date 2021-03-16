require('dotenv').config();

const { db } = require('../index');
const { getXMLfile } = require('./XMLparser');
const { seedConstituenciesTable } = require('./constituencies');
const { seedMotionsTable } = require('./motions');
const { seedMpVotesTable } = require('./mp_votes');
const { seedMpsTable } =  require('./mps');

// Helper function to set the interval to check other tables with a referencebe before start fetching data
const fetchWithInterval = function(tableName, query, number, interval, callback) {
  interval = setInterval(() => {
    db.query(query)
      .then(res => {
        if (res.rows[0].count >= number) {
          clearInterval(interval);
          console.log(`Start seeding ${tableName} table`);
          callback();
        } else {
          return;
        }
      });
  }, 1000);
};

const startSeeding = function() {
  console.log('Fetching files...');
  
  // Seed constituencies table.
  const checkConstituenciesTable = 'SELECT COUNT(*) FROM constituencies;';
  const constituenciesURL = 'https://www.ourcommons.ca/Members/en/constituencies/xml';
  let constituenciesInterval;
  
  fetchWithInterval(
    'constituencies',
    checkConstituenciesTable,
    0,
    constituenciesInterval,
    () => getXMLfile(constituenciesURL, seedConstituenciesTable)
  );
  
  // Seed motions table.
  const motionsURL = 'https://www.ourcommons.ca/members/en/votes/xml';
  let motionsInterval;

  fetchWithInterval(
    'motions',
    checkConstituenciesTable,
    338,
    motionsInterval,
    () => getXMLfile(motionsURL, seedMotionsTable)
  );

  // Seed mp_votes table.
  const maxVoteNum = [...Array(72).keys()];
  const checkMotionsTable = 'SELECT COUNT(*) FROM motions;';
  let mp_votesInterval;

  fetchWithInterval(
    'mp_votes',
    checkMotionsTable,
    72,
    mp_votesInterval,
    () => seedMpVotesTable(43, 2, maxVoteNum, getXMLfile)
  );

  // Seed mps table.
  const checkVotesTable = 'SELECT COUNT(*) FROM mp_votes;';
  let mpsInterval;

  fetchWithInterval(
    'mps',
    checkVotesTable,
    23049,
    mpsInterval,
    () => seedMpsTable(getXMLfile)
  );
};

startSeeding();