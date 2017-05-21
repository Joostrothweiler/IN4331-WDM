const express = require('express');
const morgan = require('morgan');

const { SERVER_PORT } = require('./config');

const PG = require('./pg');
const NEO = require('./neo');

const currentDb = NEO;

const server = express();

async function findAll(req, type, options) {
  const { where, page, perPage } = options;
  return currentDb.findAll(req, type, where, page, perPage);
}

async function find(req, type, id) {
  return currentDb.find(type, id);
}

server.use(morgan('combined'));

// Disable favicon
server.get('/favicon.ico', (req, res, next) => res.status(404).end());

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
