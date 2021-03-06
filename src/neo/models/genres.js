const { SESSION } = require('../connection.js');
const Genre = require('./neo4j/genre.js');
const Movie = require('./neo4j/movie.js');


const relationMap = {
  FALLS_IN: {
    model: Movie,
    field: 'movies',
    properties: 'roles',
  }
}

// TODO: Return normal error message saying no genres found.
// FIXME: Return empty object when nothing found...
// FIXME: Extract to helper function for all relations.
const manyGenres = (results) => {
  let genres = [];
  let genre = {};

  results.records.map(record => {
    let recordGenre = new Genre(record.get('genre'), false);

    if(recordGenre.id != genre.id) {
      if(genre.id != undefined) {
        genres.push(genre);
      }
      genre = recordGenre;
    }

    if(record.keys[1] == 'relationship') {
      relationType = relationMap[record.get('relationship').type]
      genre[relationType.field] = genre[relationType.field] || [];

      let relationObject = new relationType.model(record.get('n'));
      relationObject[relationType.properties] = record.get('relationship').properties[relationType.properties];
      genre[relationType.field].push(relationObject);
    }
  })
  genres.push(genre)
  return genres
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
    .run(`MATCH (genre:Genre {id: ${identifier}})-[relationship]-(n) RETURN genre, relationship, n ORDER BY n.year DESC`)
    .then(r => manyGenres(r)[0]);
}

const findAll = (where, page, perPage, order, dir) => {
  return SESSION
    .run(`MATCH (genre:Genre) RETURN genre.id SKIP ${page*perPage} LIMIT ${perPage}`)
    .then(r => {
      ids = r.records.map(a => a.get('genre.id').low)
      return SESSION
        .run(`MATCH (genre:Genre)-[relationship:FALLS_IN]-(n) WHERE genre.id IN [${ids}]
              AND n.year >= ${where.year.from} AND n.year <= ${where.year.to} RETURN genre, relationship, n ORDER BY genre.id`)
        .then(r => manyGenres(r))
    });
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
