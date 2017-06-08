const _ = require('lodash');
const connection = require('../connection.js');
const Genre = require('./neo4j/genre.js');


const manyGenres = (results) => {
  return results.records.map(r => new Genre(r.get('genre')))
}

// get all movies
const findAll = (session) => {
  return session
    .run('MATCH (genre:Genre) RETURN genre')
    .then(r => manyGenres(r));
};

module.exports = {
  findAll
};
