const express = require('express');
const router  = express.Router();
const {
  getAllMps,
  getMpById,
  getParties,
} = require('../queries/mps');

router.get('/', (req, res) => {
  const data = {
    parties: [],
    mps: [],
  };
  getAllMps()
    .then(result => data.mps = result)
    .then(() => getParties())
    .then(result => {
      result.map(party => data.parties.push(party.party_name));
      res.json(data);
    })
    .catch(err => console.log('Error while getting all mps data...\n', err));
});

router.get('/:id', (req, res) => {
  getMpById(req.params.id)
    .then(result => res.json(result))
    .catch(err => console.log(`Error while getting an mp with ID: ${req.params.id}...\n'`, err));
});

module.exports = router;