const { SESSION } = require('../connection.js');
const Genre = require('./neo4j/genre.js');


const manyGenres = (results) => {
  return results.records.map(r => new Genre(r.get('genre')));
}

const insert = (object) => {
  return SESSION
    .run(`CREATE (genre:Genre {
        id: ${object.id},
        genre: '${object.genre}'
      }) RETURN genre`)
    .then(r => manyGenres(r)[0]);
}

const find = (identifier) => {
  return SESSION
    .run(`MATCH (genre:Genre {id: ${identifier}})-[relationship]-(m) RETURN genre, relationship, m`)
    .then(r => manyGenres(r)[0]);
}

// get all movies
const findAll = () => {
  return SESSION
    .run('MATCH (genre:Genre) RETURN genre')
    .then(r => manyGenres(r));
};

const deleteAll = () => {
  return SESSION
    .run(`MATCH (genre:Genre) DETACH DELETE genre`)
    .then(r => r);
}

module.exports = {
  findAll,
  insert,
  find,
  deleteAll
};
