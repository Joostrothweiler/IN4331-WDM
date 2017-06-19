const express = require('express');

const ORM = require('../orm');

const router = express.Router();

router.get('/scenario1', (req, res, next) => {
  res.json({ hello: 'world' })
});

module.exports = router;
