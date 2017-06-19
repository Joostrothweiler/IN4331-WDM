const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const _ = require('lodash');

const { SERVER_PORT } = require('./config');
const ORM = require('./orm');

const server = express();

server.use(bodyParser.urlencoded({
  extended: true
}));

server.use(morgan('combined'));

// Disable favicon
server.get('/favicon.ico', (req, res, next) => res.status(404).end());

server.post('/:database/:type', (req, res, next) => {
  const { database, type } = req.params;
  if (_.isEmpty(req.body)) throw new Error(`Empty body submitted to insertion`);

  ORM.insertModel(database, type, { model: req.body }).then(results => {
    res.json(results);
  }).catch(next);
});

server.get('/:database/:type', (req, res, next) => {
  const { database, type } = req.params;
  const { page = 0, perPage = 10, dir = 'asc', orderby = 'id'} = req.query;

  let where = Object.assign({}, req.query);
  delete where.page;
  delete where.perPage;
  delete where.dir;
  delete where.orderby;

  ORM.findAll(database, type, { where, page, perPage, orderby, dir }).then(results => {
    res.json(results);
  }).catch(next);
});

// Post request to delete all entries from database.
server.delete('/:database/:type', (req, res, next) => {
  const { database, type } = req.params;
  const { page = 0, perPage = 10 } = req.query;

  let where = Object.assign({}, req.query);
  delete where.page;
  delete where.perPage;

  ORM.deleteAll(database, type, { where, page, perPage }).then(results => {
    res.json(results);
  }).catch(next);
});

server.get('/:database/:type/:id', (req, res, next) => {
  const { database, type, id } = req.params;

  ORM.find(database, type, { id }).then(result => {
    res.json(result);
  }).catch(next);
});

server.get('/:database/:type/:id/:tail', (req, res, next) => {
  const { database, type, id, tail } = req.params;

  ORM.find(database, type, { id, tail }).then(result => {
    res.json(result);
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

server.use((error, req, res, next) => {
  console.error(error);
  res.status(400);
  res.json({ message: error.message });
  next(error);
});

console.log(`Starting server on port ${SERVER_PORT}`);
server.listen(SERVER_PORT);
