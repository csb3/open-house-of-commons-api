DROP TABLE IF EXISTS constituencies CASCADE;

CREATE TABLE constituencies (
  id SERIAL PRIMARY KEY NOT NULL, 
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL
);