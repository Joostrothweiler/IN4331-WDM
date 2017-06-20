const express = require('express');

const pgScenario1 = require('./pg/scenario1');
const pgScenario2 = require('./pg/scenario2');
const pgScenario3 = require('./pg/scenario3');
const pgScenario4 = require('./pg/scenario4');
const pgScenario5 = require('./pg/scenario5');

const neoScenario1 = require('./neo/scenario1');
const neoScenario2 = require('./neo/scenario2');
const neoScenario3 = require('./neo/scenario3');
const neoScenario4 = require('./neo/scenario4');
const neoScenario5 = require('./neo/scenario5');

const mongoScenario1 = require('./mongo/scenario1');
const mongoScenario2 = require('./mongo/scenario2');
const mongoScenario3 = require('./mongo/scenario3');
const mongoScenario4 = require('./mongo/scenario4');
const mongoScenario5 = require('./mongo/scenario5');

const router = express.Router();

router.get('/pg/scenario1/:id*?', pgScenario1);
router.get('/pg/scenario2/:id*?', pgScenario2);
router.get('/pg/scenario3/:id*?', pgScenario3);
router.get('/pg/scenario4/:id*?', pgScenario4);
router.get('/pg/scenario5/:id*?', pgScenario5);

router.get('/neo/scenario1/:id*?', neoScenario1);
router.get('/neo/scenario2/:id*?', neoScenario2);
router.get('/neo/scenario3/:id*?', neoScenario3);
router.get('/neo/scenario4/:id*?', neoScenario4);
router.get('/neo/scenario5/:id*?', neoScenario5);

router.get('/mongo/scenario1/:id*?', mongoScenario1);
router.get('/mongo/scenario2/:id*?', mongoScenario2);
router.get('/mongo/scenario3/:id*?', mongoScenario3);
router.get('/mongo/scenario4/:id*?', mongoScenario4);
router.get('/mongo/scenario5/:id*?', mongoScenario5);

module.exports = router;
