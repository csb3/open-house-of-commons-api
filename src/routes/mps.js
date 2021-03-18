const express = require('express');
const router  = express.Router();
const {
  getAllMps,
  getMpById,
} = require('../queries/mps');

router.get('/', (req, res) => {
  getAllMps()
    .then(result => res.json(result))
    .catch(err => console.log('Error while getting all mps data...\n', err));
});

router.get('/:id', (req, res) => {
  getMpById(req.params.id)
    .then(result => res.json(result))
    .catch(err => console.log(`Error while getting an mp with ID: ${req.params.id}...\n'`, err));
});

module.exports = router;