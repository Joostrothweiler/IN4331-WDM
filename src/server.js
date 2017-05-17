const express = require('express');
const morgan = require('morgan');

const { SERVER_PORT } = require('./config');

const server = express();

server.use(morgan('combined'));

// Disable favicon
server.get('/favicon.ico', (req, res, next) => res.status(404).end());

server.get('/', (req, res) => {
  res.json({ msg: 'hello world!' });
});

console.log(`Starting server on port ${SERVER_PORT}`);
server.listen(SERVER_PORT);
