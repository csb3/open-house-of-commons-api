DROP TABLE IF EXISTS mps CASCADE;

CREATE TABLE mps (
  -- PersonId is mp id
  id PRIMARY KEY NOT NULL,
  first_name VARCHAR(255) NOT NULL,  
  last_name VARCHAR(255) NOT NULL,
  party_id INTEGER NOT NULL REFERENCES parties(id) ON DELETE CASCADE,
  constituency_id INTEGER REFERENCES constituencies(id) NOT NULL
);