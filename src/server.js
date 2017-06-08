const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const { SERVER_PORT } = require('./config');

const PG = require('./pg');
const NEO = require('./neo');

const currentDb = NEO;

const server = express();

server.use(bodyParser.urlencoded({
  extended: true
}));

async function findAll(req, type, options, responseDb = currentDb) {
  const { where, page, perPage } = options;
  return responseDb.findAll(req, type, where, page, perPage);
}

async function find(req, type, id, responseDb = currentDb) {
  return responseDb.find(req, type, id);
}

async function insertModel(req, type, object, responseDb = currentDb) {
  return responseDb.insertModel(req, type, object);
}

server.use(morgan('combined'));
// Disable favicon
server.get('/favicon.ico', (req, res, next) => res.status(404).end());

server.get('/migrate/:type', (req, res, next) => {
  const { type } = req.params;
  const { page = 0, perPage = 100 } = req.query;
  let where = Object.assign({}, req.query);
  delete where.page;
  delete where.perPage;
  findAll(req, type, { where, page, perPage }, PG).then(results => {
    for (var movie of results) {
      const object = { 'pg_id': movie.id, 'title': movie.title, 'year': movie.year };

      insertModel(req, type, object, NEO).then(results => {
        res.json('inserted movies into NEO');
      }).catch(next);
    }
  }).catch(next);
});

server.post('/:type', (req, res, next) => {
  const { type } = req.params;

  insertModel(req, type, req.body).then(results => {
    res.json(results);
  }).catch(next);
});

server.get('/:type', (req, res, next) => {
  const { type } = req.params;
  const { page = 0, perPage = 10 } = req.query;

  let where = Object.assign({}, req.query);
  delete where.page;
  delete where.perPage;

  findAll(req, type, where,{ page, perPage }).then(results => {
    console.log(`Number of results for ${type}:`, results.length);
    res.json(results);
  }).catch(next);
});

server.get('/:type/:id', (req, res, next) => {
  const { type, id } = req.params;
  find(type, id).then(result => {
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
