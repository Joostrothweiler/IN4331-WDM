const express = require('express');
const morgan = require('morgan');

const { SERVER_PORT } = require('./config');

const PG = require('./pg');
const NEO = require('./neo');

const currentDb = NEO;

const server = express();

async function findAll(req, type, options) {
  const { page, perPage } = options;
  return currentDb.findAll(req, type, page, perPage);
}

server.use(morgan('combined'));

// Disable favicon
server.get('/favicon.ico', (req, res, next) => res.status(404).end());

server.get('/:type', (req, res, next) => {
  const { type } = req.params;
  const { page = 0, perPage = 10 } = req.query;
  findAll(req, type, { page, perPage }).then(results => {
    console.log(`Number of results for ${type}:`, results.length);
    res.json(results);
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
