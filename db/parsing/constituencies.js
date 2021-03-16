const { db } = require('../index');
const { getXMLfile } = require('./helpers');

/**
 * @params {constituencies: Array}
 * @return {Promise<{}>}
 */
const seedTable = function(constituencies) {
  const constituency = constituencies[0];
  const queryString = 'INSERT INTO constituencies (name, location) VALUES ($1, $2);';
  const queryParams = [constituency.Name[0], constituency.ProvinceTerritoryName[0]];

  // If constituencies array has more than 1 element,
  // seed the db and call itself(recurse) with first element(seeded just now) removed.
  if (constituencies.length > 1) {
    return new Promise((resolve, reject) =>
      resolve(
        db.query(queryString, queryParams)
          .then(() => seedTable(constituencies.slice(1)))
      )
    );
  }

  // Base case for the last call will resolve consitituencies() in db/parsing/index.js
  return new Promise((resolve, reject) =>
    resolve(
      db.query(queryString, queryParams)
    )
  );
};

// Bridge function
const processXML = function(parsedXML) {
  const constituencies = parsedXML.ArrayOfConstituency.Constituency;

  return new Promise((resolve, reject) =>
    resolve(seedTable(constituencies))
  );
};

const constituencies = function() {
  const url = 'https://www.ourcommons.ca/Members/en/constituencies/xml';
  
  console.log('Starting for constituencies...');

  // Fetch XML files from the URL, resolve the result (parsed data) and return it to processXML.
  // console.log won't be executed until processXML resolves.
  return new Promise((resolve, reject) =>
    resolve(
      getXMLfile(url)
        .then(result => processXML(result))
        .then(() => console.log('Completed: constituencies table'))
    )
  );
};

module.exports = {
  constituencies,
};