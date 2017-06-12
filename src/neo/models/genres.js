const { SESSION } = require('../connection.js');
const Genre = require('./neo4j/genre.js');


const manyGenres = (results) => {
  return results.records.map(r => new Genre(r.get('genre')))
}

// get all movies
const findAll = () => {
  return SESSION
    .run('MATCH (genre:Genre) RETURN genre')
    .then(r => manyGenres(r));
};

module.exports = {
  findAll
};
