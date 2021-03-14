require('dotenv').config();
const https = require('https');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const concat = require('concat-stream');
const db = require('../index.js'); 

const sqlQuery = `INSERT INTO constituencies (name, location) VALUES ($1, $2)`;

parser.on('error', function(err) { console.log('Parser error', err); });

const seedingConst = async function(result) {
  for (const constituency of result.ArrayOfConstituency.Constituency){
    const queryParams = [constituency.Name[0], constituency.ProvinceTerritoryName[0]];

    try {
      db.query(sqlQuery, queryParams);
    } catch(error) {
      console.log(error, "NAY");
    }
  }
};

https.get('https://www.ourcommons.ca/Members/en/constituencies/xml', function(resp) {
  resp.on('error', function(err) {
    console.log('Error while reading', err);
  });

  resp.pipe(concat(function(buffer) {
    let str = buffer.toString();
    
    parser.parseString(str, function(err, result) {
      seedingConst(result);
    });
  }));
});