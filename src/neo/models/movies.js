const { SESSION } = require('../connection.js');
const Movie = require('./neo4j/movie.js');
const Actor = require('./neo4j/actor.js');
const Genre = require('./neo4j/genre.js');

const relationMap = {
  ACTED_IN: {
    model: Actor,
    field: 'actors',
    properties: 'roles',
  },
  FALLS_IN: {
    model: Genre,
    field: 'genres',
  }
}

// TODO: Return normal error message saying no movies found.
// FIXME: Return empty object when nothing found...
// FIXME: Extract to helper function for all relations.
const manyMovies = (results) => {
  let movies = [];
  let movie = {};

  results.records.map(record => {
    let recordMovie = new Movie(record.get('movie'), false);

    if(recordMovie.id != movie.id) {
      if(movie.id != undefined) {
        movies.push(movie);
      }
      movie = recordMovie;
    }
    if(record.keys[1] == 'relationship') {
      relationType = relationMap[record.get('relationship').type]
      movie[relationType.field] = movie[relationType.field] || [];

      let relationObject = new relationType.model(record.get('n'));

      if(relationType.properties != undefined) {
        relationObject[relationType.properties] = record.get('relationship').properties[relationType.properties];
      }
      movie[relationType.field].push(relationObject);
    }
  })
  movies.push(movie)
  return movies
}

const insert = (object) => {
  object.year = object.year.length == 4 ? object.year : null;

  return SESSION
    .run(`CREATE (movie:Movie {id:${object.id}, title:"${object.title}", year:${object.year}}) RETURN movie`)
    .then(r => manyMovies(r)[0]);
}

const insertGenre = (movieId, genreId) => {
  return SESSION
    .run(`MATCH (movie:Movie) WHERE movie.id = ${movieId}
          MATCH (genre:Genre) WHERE genre.id = ${genreId}
          CREATE (movie)-[:FALLS_IN]->(genre)
          RETURN movie`)
    .then(r => r);
}

const find = (identifier) => {
  return SESSION
    .run(`MATCH (movie:Movie {id: ${identifier}})-[relationship]-(n) RETURN movie, relationship, n`)
    .then(r => manyMovies(r)[0]);
}

const findAll = (where, page, perPage, orderby, dir) => {
  return SESSION
    .run(`MATCH (movie:Movie) RETURN movie.id ORDER BY movie.${orderby} ${dir} SKIP ${Math.max(0,page-1)*perPage} limit ${perPage}`)
    .then(r => {
      ids = r.records.map(a => a.get('movie.id').low)
      return SESSION
        .run(`MATCH (movie:Movie)-[relationship]-(n) WHERE movie.id IN [${ids}] RETURN movie, relationship, n`)
        .then(r => manyMovies(r))
    });
};

const deleteAll = () => {
  return SESSION
    .run(`MATCH (movie:Movie) DETACH DELETE movie`)
    .then(r => r);
}

module.exports = {
  insert,
  insertGenre,
  find,
  findAll,
  deleteAll
};
