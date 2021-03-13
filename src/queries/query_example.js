const db = require('./../db/index');

// Query example.
const findById = function(id) {
  const query = `
  SELECT *
  FROM votes
  WHERE id=$1
  `;

  const params = [id];

  return db.query(query, params).then(res => res.rows);
};

module.exports = {
  findById,
};