const _ = require('lodash');
const connection = require('../connection.js');
const Actor = require('./neo4j/actor.js');


const manyMovies = (results) => {
  return results.records.map(r => new Actor(r.get('actor')))
}

// get all movies
const findAll = (session) => {
  return session
    .run('MATCH (actor:Actor) RETURN actor')
    .then(r => manyMovies(r));
};

module.exports = {
  findAll
};
