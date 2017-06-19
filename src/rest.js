const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const ORM = require('./orm');
const { checkScenario, processScenario } = require('./scenario');

const router = express.Router();

router.use(bodyParser.urlencoded({
  extended: true
}));

// Index
router.get('/:database/:type/:scenario*?', (req, res, next) => {
  const { database, type, scenario } = req.params;
  if (scenario != null && !checkScenario(scenario)) return next();
  const { page = 0, perPage = 10, dir = 'asc', orderby = 'id'} = req.query;

  let where = Object.assign({}, req.query);
  delete where.page;
  delete where.perPage;
  delete where.dir;
  delete where.orderby;

  ORM.findAll(database, type, { where, page, perPage, orderby, dir })
    .then(processScenario(scenario))
    .then(results => {
    res.json(results);
  }).catch(next);
});

// Show
router.get('/:database/:type/:id/:scenario*?', (req, res, next) => {
  const { database, type, id, scenario } = req.params;
  // if (scenario != null && !checkScenario(scenario)) return next();
  // console.log('Scenario:', scenario, processScenario.toString());

  ORM.find(database, type, { id })
    .then(processScenario(scenario))
    .then(result => {
      res.json(result);
    }).catch(next);
});

// Create
router.post('/:database/:type', (req, res, next) => {
  const { database, type } = req.params;
  if (_.isEmpty(req.body)) throw new Error(`Empty body submitted to insertion`);

  ORM.insertModel(database, type, { model: req.body }).then(results => {
    res.json(results);
  }).catch(next);
});

// Post request to delete all entries from database.
router.delete('/:database/:type', (req, res, next) => {
  const { database, type } = req.params;
  const { page = 0, perPage = 10 } = req.query;

  let where = Object.assign({}, req.query);
  delete where.page;
  delete where.perPage;

  ORM.deleteAll(database, type, { where, page, perPage })
    // .then(processScenario(scenario))
    .then(results => {
      res.json(results);
    }).catch(next);
});

// Insert actor - movie relation by passing actor and movie id.
server.post('/:database/actors/:actor/movies/:movie', (req, res, next) => {
  const { database, actor, movie } = req.params;
  const { roles } = req.query;

  console.log(movie)

  ORM.insertMovieRole(database, actor, movie, roles).then(result => {
    res.json(result);
  }).catch(next);
});

module.exports = router;
