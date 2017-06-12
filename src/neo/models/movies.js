const { SESSION } = require('../connection.js');
const Movie = require('./neo4j/movie.js');

// returns empty array if no movies found.
// TODO: Return normal error message saying no movies found.
const manyMovies = (results) => {
  return results.records.map(r => new Movie(r.get('movie')));
}

const insert = (object) => {
  return SESSION
    .run(`CREATE (movie:Movie {id:${object.id}, title:"${object.title}", year:"${object.year}"}) RETURN movie`)
    .then(r => manyMovies(r));
}

const find = (identifier) => {
  return SESSION
    .run(`MATCH (movie:Movie) WHERE
      movie.id = ${identifier} RETURN movie`)
    .then(r => manyMovies(r)[0]);

    // Fuzzy matching - see if we want to do this later.
    // return SESSION
    //   .run(`MATCH (movie:Movie) WHERE
    //     movie.id = ${identifier} OR
    //     movie.title =~ "(?i).*${identifier}.*" RETURN movie`)
    //   .then(r => manyMovies(r));
}

const findAll = () => {
  return SESSION
    .run(`MATCH (movie:Movie) RETURN movie`)
    .then(r => manyMovies(r));
};

const deleteAll = () => {
  return SESSION
    .run(`MATCH (movie:Movie) DETACH DELETE movie`)
    .then(r => r);
}

module.exports = {
  insert,
  find,
  findAll,
  deleteAll
};
