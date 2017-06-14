const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const _ = require('lodash');

const { SERVER_PORT } = require('./config');

const PG = require('./pg');
const NEO = require('./neo');

const databaseMap = {
  'pg': PG,
  'neo': NEO
}

function _getDatabase(db) {
  if (!(db in databaseMap)) throw new Error(`'${db}' is not a valid database name.`);
  return databaseMap[db];
}

const server = express();

server.use(bodyParser.urlencoded({
  extended: true
}));

async function findAll(db, type, options) {
  const { where, page, perPage, orderby, dir } = options;
  return db.findAll(type, where, page, perPage, orderby, dir);
}

async function deleteAll(db, type, options) {
  const { where, page, perPage } = options;
  return db.deleteAll(type, where, page, perPage);
}

async function find(db, type, id) {
  return db.find(type, id);
}

async function insertModel(db, type, object) {
  return db.insertModel(type, object);
}

async function insertMovieRole(db, actorId, movieId, roles) {
  return db.insertMovieRole(actorId, movieId, roles);
}

server.use(morgan('combined'));
// Disable favicon
server.get('/favicon.ico', (req, res, next) => res.status(404).end());

server.post('/:database/:type', (req, res, next) => {
  const { database, type } = req.params;
  const currentDb = _getDatabase(database);
  if (_.isEmpty(req.body)) throw new Error(`Empty body submitted to insertion`);

  insertModel(currentDb, type, req.body).then(results => {
    res.json(results);
  }).catch(next);
});

server.get('/:database/:type', (req, res, next) => {
  const { database, type } = req.params;
  const { page = 0, perPage = 10, dir = 'asc', orderby = 'id'} = req.query;
  const currentDb = _getDatabase(database);

  let where = Object.assign({}, req.query);
  delete where.page;
  delete where.perPage;
  delete where.dir;
  delete where.orderby;

  findAll(currentDb, type, { where, page, perPage, orderby, dir }).then(results => {
    res.json(results);
  }).catch(next);
});

// Post request to delete all entries from database.
server.delete('/:database/:type', (req, res, next) => {
  const { database, type } = req.params;
  const { page = 0, perPage = 10 } = req.query;
  const currentDb = _getDatabase(database);

  let where = Object.assign({}, req.query);
  delete where.page;
  delete where.perPage;

  deleteAll(currentDb, type, { where, page, perPage }).then(results => {
    res.json(results);
  }).catch(next);
});

server.get('/:database/:type/:id', (req, res, next) => {
  const { database, type, id } = req.params;
  const currentDb = _getDatabase(database);

  find(currentDb, type, id).then(result => {
    res.json(result);
  }).catch(next);
});

// Insert actor - movie relation by passing actor and movie id.
server.post('/:database/actors/:actor/movies/:movie', (req, res, next) => {
  const { database, actor, movie } = req.params;
  const { roles } = req.query;
  const currentDb = _getDatabase(database);

  insertMovieRole(currentDb, actor, movie, roles).then(result => {
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
