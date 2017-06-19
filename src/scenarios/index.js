const express = require('express');

const scenario1 = require('./scenario1');
const scenario2 = require('./scenario2');
const scenario3 = require('./scenario3');
const scenario4 = require('./scenario4');
const scenario5 = require('./scenario5');

const router = express.Router();

router.get('/:database/scenario1/:id*?', scenario1);
router.get('/:database/scenario2/:id*?', scenario2);
router.get('/:database/scenario3/:id*?', scenario3);
router.get('/:database/scenario4/:id*?', scenario4);
router.get('/:database/scenario5/:id*?', scenario5);

module.exports = router;
