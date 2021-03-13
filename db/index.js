const { Pool } = require('pg');

// Setting up your local psql database.
// Inside of .env file,
// DEVELOPMENT="postgresql://labber:labber@localhost:5432/ohoc_development"
// This will target the database 'ohoc_development'
// with username 'labber' and password 'labber'
// and the URL is localhost:5432
// Make sure the owner of 'ohoc_development' is 'labber'
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.DEVELOPMENT,
});

module.exports = {
  async query(text, params) {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
  },
}
