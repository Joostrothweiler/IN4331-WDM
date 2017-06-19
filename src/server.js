const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const { SERVER_PORT } = require('./config');

const Scenarios = require('./scenarios');
const REST = require('./rest');

const server = express();

server.use(bodyParser.urlencoded({
  extended: true
}));

server.use(morgan('combined'));

// Disable favicon
server.get('/favicon.ico', (req, res, next) => res.status(404).end());

server.use(Scenarios);
server.use(REST);

server.use((error, req, res, next) => {
  console.error(error);
  res.status(400);
  res.json({ message: error.message });
  next(error);
});

console.log(`Starting server on port ${SERVER_PORT}`);
server.listen(SERVER_PORT);
