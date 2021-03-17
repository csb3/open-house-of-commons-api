require('dotenv').config();

const { constituencies } = require('./constituencies');
const { motions }        = require('./motions');
const { mp_votes }       = require('./mp_votes');
const { mps }            = require('./mps');

/**
 * Do not alter the order of execution unless necessary.
 * Make sure to run the tables being referenced first.
 * Functions should not to be invoked before the previous function finish its task.
 */
const fetchAll = async function() {
  console.log('Start database setup...');

  return new Promise((resolve, reject) =>
    resolve(
      constituencies()
        .then(() => motions())
        .then(() => mp_votes())
        .then(() => mps())
        .then(() => console.log('All done!'))
        .catch(error => console.log(error))
    )
  );
};

// Remove this once the automatic update functionality is implemented.
fetchAll();