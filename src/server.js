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
server.use('/:database', REST);

server.use((error, req, res, next) => {
  console.error(error);
  res.status(400);
  res.json({ message: error.message });
  next(error);
});

console.log(`Starting server on port ${SERVER_PORT}`);

let routes = [];
server._router.stack.map(function(middleware){
  if(middleware.route){ // routes registered directly on the app
      let { methods, path } = middleware.route;
      routes.push(`${Object.keys(methods).join(', ')}: ${path}`);
  } else if(middleware.name === 'router'){ // router middleware
      middleware.handle.stack.forEach(function(handler){
          route = handler.route;
          let { methods, path } = route || {};
          route && routes.push(`${Object.keys(methods).join(', ')}: ${path}`);
      });
  }
});

console.log(`The following routes are registered:`);
routes.forEach(route => console.log(route));

server.listen(SERVER_PORT);
