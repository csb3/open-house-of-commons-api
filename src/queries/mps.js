const { db } = require('./../../db/index');

const dbQuery = function(query) {
  console.log(`Query: ${query.string}`);
  return (
    db.query(query.string, query.params)
      .then(res => res.rows)
  );
};

const getAllMps = function() {
  const query = {
    string: `
      SELECT mps.id AS id, mps.first_name AS first_name, mps.last_name AS last_name, mps.party_name AS party_name, constituencies.name AS constituency, constituencies.location AS location
      FROM mps JOIN constituencies ON constituencies.id = mps.constituency_id ORDER BY last_name, first_name;
    `,
    params: [],
  };

  return dbQuery(query);
};

const getMpById = function(id) {
  const query = {
    string: `
      SELECT mps.id AS id, mps.first_name AS first_name, mps.last_name AS last_name, mps.party_name AS party_name, constituencies.name AS constituency, constituencies.location AS location
      FROM mps JOIN constituencies ON constituencies.id = mps.constituency_id WHERE mps.id=$1;
    `,
    params: [id],
  };

 return dbQuery(query);
};

module.exports = {
  getAllMps,
  getMpById,
};