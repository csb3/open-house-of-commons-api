DROP TABLE IF EXISTS parties CASCADE;

CREATE TABLE parties (
  id SERIAL PRIMARY KEY NOT NULL, 
  name VARCHAR(255) NOT NULL
);