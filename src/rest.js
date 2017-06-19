const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const ORM = require('./orm');

const router = express.Router({ mergeParams: true });

router.use(bodyParser.urlencoded({
  extended: true
}));

// Index
router.get('/:type', (req, res, next) => {

  const { database, type } = req.params;
  const { page = 0, perPage = 10, dir = 'asc', orderby = 'id'} = req.query;

  // console.log('Indexing', req.params);
  console.log(`Showing index of ${type} with context:`, res.locals.context);

  let where = Object.assign({}, req.query);
  delete where.page;
  delete where.perPage;
  delete where.dir;
  delete where.orderby;

  ORM.findAll('pg', type, { where, page, perPage, orderby, dir }, res.locals.context)
    .then(results => {
    res.json(results);
  }).catch(next);
});

// Show
router.get('/:type/:id', (req, res, next) => {
  const { database, type, id } = req.params;

  ORM.find('pg', type, { id })
    .then(result => {
      res.json(result);
    }).catch(next);
});

function log(req, res, next) {
  console.log('Nested route', req.params);

  res.locals.context = [].concat(res.locals.context || [], req.params);

  next();
}

// Nested routes
router.use('/:super_type/:super_id',
  log,
  router
);

// Create
router.post('/:type', (req, res, next) => {
  const { database, type } = req.params;
  if (_.isEmpty(req.body)) throw new Error(`Empty body submitted to insertion`);

  ORM.insertModel('pg', type, { model: req.body }).then(results => {
    res.json(results);
  }).catch(next);
});

// Post request to delete all entries from database.
router.delete('/:type', (req, res, next) => {
  const { database, type } = req.params;
  const { page = 0, perPage = 10 } = req.query;

  let where = Object.assign({}, req.query);
  delete where.page;
  delete where.perPage;

  ORM.deleteAll('pg', type, { where, page, perPage })
    .then(results => {
      res.json(results);
    }).catch(next);
});

// Insert actor - movie relation by passing actor and movie id.
router.post('/actors/:actor/movies/:movie', (req, res, next) => {
  const { database, actor, movie } = req.params;
  const { roles } = req.query;

  console.log(movie)

  ORM.insertMovieRole('pg', actor, movie, roles).then(result => {
    res.json(result);
  }).catch(next);
});

module.exports = router;
