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
  const { where, page, perPage } = options;
  return db.findAll(type, where, page, perPage);
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

server.use(morgan('combined'));
// Disable favicon
server.get('/favicon.ico', (req, res, next) => res.status(404).end());

server.get('/migrate/:type', (req, res, next) => {
  const { type } = req.params;
  const { page = 0, perPage = 10 } = req.query;
  let where = Object.assign({}, req.query);
  delete where.page;
  delete where.perPage;
  findAll(req, type, { where, page, perPage }, PG).then(results => {
    for (var movie of results) {
      const object = { 'id': movie.id, 'title': movie.title, 'year': movie.year };

      insertModel(req, type, object, NEO).then(results => {
        res.json('inserted movies into NEO');
      }).catch(next);
    }
  }).catch(next);
});

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
  const { page = 0, perPage = 10 } = req.query;
  const currentDb = _getDatabase(database);

  let where = Object.assign({}, req.query);
  delete where.page;
  delete where.perPage;

  findAll(currentDb, type, { where, page, perPage }).then(results => {
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
    // console.log(`Result for ${type} ${id}:`, result);
    res.json(result);
  }).catch(next);
});

// Insert actor - movie relation by passing actor and movie id.
server.post('/:database/actor/:actor/movies/:movie', (req, res, next) => {
  const { database, actor, movie } = req.params;
  const currentDb = _getDatabase(database);

  insertMovieRole(currentDb, type, actor, movie).then(result => {
    // console.log(`Result for ${type} ${id}:`, result);
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
