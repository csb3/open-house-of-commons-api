const { db } = require('../index');

const seedConstituenciesTable = async function(parsedXML) {
  const queryString = `INSERT INTO constituencies (name, location) VALUES ($1, $2)`;
  const constituencies = parsedXML.ArrayOfConstituency.Constituency;
  
  for await (const constituency of constituencies) {
    const queryParams = [constituency.Name[0], constituency.ProvinceTerritoryName[0]];
    
    db.query(queryString, queryParams);
  }
};

module.exports = {
  seedConstituenciesTable,
};