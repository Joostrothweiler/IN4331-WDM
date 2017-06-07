const _ = require('lodash');
const connection = require('../connection.js');
const Movie = require('./neo4j/movie.js');

// returns empty array if no movies found.
// TODO: Return normal error message saying no movies found.
const manyMovies = (results) => {
  return results.records.map(r => new Movie(r.get('movie')));
}

const insert = (session, object) => {
  return session
    .run(`CREATE (movie:Movie {title:'${object.title}', released:${object.year}, tagline:'${object.tagline}'}) RETURN movie`)
    .then(r => manyMovies(r));
}

// Fuzzy matching title based on parts and lower case.
const find = (session, title) => {
  return session
    .run(`MATCH (movie:Movie) WHERE movie.title =~ '(?i).*${title}.*' RETURN movie`)
    .then(r => manyMovies(r));
}

const findAll = (session) => {
  return session
    .run('MATCH (movie:Movie) RETURN movie')
    .then(r => manyMovies(r));
};

module.exports = {
  insert,
  find,
  findAll
};
