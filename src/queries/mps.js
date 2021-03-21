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

const getParties = function() {
  const query = {
    string: `
      SELECT party_name FROM mps GROUP BY party_name ORDER BY COUNT(party_name) DESC;
    `,
    params: [],
  };

  return dbQuery(query);
};

const getAllVotesForMp = function(id) {
  const query = {
    string: `
      SELECT m.id AS id, v.voted_yea AS voted_yea, v.voted_nay AS voted_nay, v.vote_paired AS vote_paired, m.vote_num AS vote_num, m.parl_num AS parl_num, m.sess_num AS sess_num, m.sitting_num AS sitting_num, m.bill_num AS bill_num, m.date AS date, m.result AS result, m.bill_url AS bill_url
      FROM mp_votes v JOIN motions m ON m.id = v.motion_id WHERE v.mp_id=$1 ORDER BY vote_num DESC;
    `,
    params: [id],
  }

  return dbQuery(query);
}

const getSponsoredMotions = function(id) {
  const query = {
    string: `
      SELECT vote_num, parl_num, sess_num, sitting_num, bill_num, date, result, bill_url
      FROM motions WHERE mp_id=$1 ORDER BY vote_num DESC;
    `,
    params: [id],
  }

  return dbQuery(query);
}

module.exports = {
  getAllMps,
  getMpById,
  getParties,
  getAllVotesForMp,
  getSponsoredMotions,
};