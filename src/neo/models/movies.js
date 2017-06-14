const { SESSION } = require('../connection.js');
const Movie = require('./neo4j/movie.js');
const Actor = require('./neo4j/actor.js');

const relationMap = {
  ACTED_IN: {
    model: Actor,
    field: 'actors',
    properties: 'roles',
  }
}

// TODO: Return normal error message saying no movies found.
const manyMovies = (results) => {
  return results.records.map(r => new Movie(r.get('movie')));
}

const singleMovie = (results) => {
  if (results.records.length == 0) {
    return
  }
  let movie = new Movie(results.records[0].get('movie'), false);

  // Fetch all relationships and insert based on relationMap.
  results.records.map(res => {
    if(relationType = relationMap[res.get('relationship').type]) {
      movie[relationType.field] = movie[relationType.field] || [];

      let relationObject = new relationType.model(res.get('n'));
      relationObject[relationType.properties] = res.get('relationship').properties[relationType.properties];
      movie[relationType.field].push(relationObject);

    }
  })
  return movie;
}

const insert = (object) => {
  object.year = object.year.length == 4 ? object.year : null;

  return SESSION
    .run(`CREATE (movie:Movie {id:${object.id}, title:"${object.title}", year:${object.year}}) RETURN movie`)
    .then(r => manyMovies(r)[0]);
}

const find = (identifier) => {
  return SESSION
    .run(`MATCH (movie:Movie {id: ${identifier}})-[relationship]-(n) RETURN movie, relationship, n`)
    .then(r => singleMovie(r));
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
