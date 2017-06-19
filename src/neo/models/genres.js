const { SESSION } = require('../connection.js');
const Genre = require('./neo4j/genre.js');


const manyGenres = (results) => {
  return results.records.map(r => new Genre(r.get('genre')));
}

const insert = (object) => {
  console.log(object.genre)
  return SESSION
    .run(`CREATE (genre:Genre {
        id: ${object.id},
        genre: '${object.genre}'
      }) RETURN genre`)
    .then(r => manyGenres(r)[0]);
}

// get all movies
const findAll = () => {
  return SESSION
    .run('MATCH (genre:Genre) RETURN genre')
    .then(r => manyGenres(r));
};

module.exports = {
  findAll,
  insert
};
