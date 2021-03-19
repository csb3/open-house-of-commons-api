DROP TABLE IF EXISTS motions CASCADE;

CREATE TABLE motions (
  id SERIAL PRIMARY KEY NOT NULL, 
  vote_num INTEGER NOT NULL,
  parl_num INTEGER NOT NULL,
  sess_num INTEGER NOT NULL,
  sitting_num INTEGER NOT NULL,
  bill_num VARCHAR(255),
  bill_url VARCHAR(255),
  motion_url VARCHAR(255) NOT NULL,
  -- mp_id for motion sponsor
  mp_id INTEGER,
  date TIMESTAMP NOT NULL,
  result VARCHAR(255) NOT NULL,
  summary TEXT NOT NULL
);