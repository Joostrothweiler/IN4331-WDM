const express = require('express');
const morgan = require('morgan');

const { SERVER_PORT } = require('./config');

const PG = require('./pg');

const server = express();

server.use(morgan('combined'));

// Disable favicon
server.get('/favicon.ico', (req, res, next) => res.status(404).end());

server.get('/:type', (req, res, next) => {
  const { type } = req.params;
  PG.findAll(type)
    .then(results => {
      console.log(`Results for ${type}:`, results);
      res.json(results);
    }).catch(next);
});

server.use((error, req, res) => {
  console.error(error);
  res.status(400).json({ error: error });
});

console.log(`Starting server on port ${SERVER_PORT}`);
server.listen(SERVER_PORT);
