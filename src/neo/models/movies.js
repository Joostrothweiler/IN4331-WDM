const _ = require('lodash');
const connection = require('../connection.js');
const Movie = require('./neo4j/movie.js');


const manyMovies = (results) => {
  return results.records.map(r => new Movie(r.get('movie')))
}

// get all movies
const findAll = (session) => {
  return session
    .run('MATCH (movie:Movie) RETURN movie')
    .then(r => manyMovies(r));
};

module.exports = {
  findAll
};
