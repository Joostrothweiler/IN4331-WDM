const { SESSION } = require('../connection.js');
const Movie = require('./neo4j/movie.js');
const Actor = require('./neo4j/actor.js');

const relationMap = {
  ACTED_IN: {
    model: Movie,
    field: 'movies',
    properties: 'roles',
  }
}

const manyActors = (results) => {
  return results.records.map(r => new Actor(r.get("actor"), false))
}

const singleActor = (results) => {
  if (results.records.length == 0) {
    return
  }
  let actor = new Actor(results.records[0].get('actor'), false);

  // Fetch all relationships and insert based on relationMap.
  results.records.map(res => {
    if(relationType = relationMap[res.get('relationship').type]) {
      actor[relationType.field] = actor[relationType.field] || [];

      let relationObject = new relationType.model(res.get('n'));
      relationObject[relationType.properties] = res.get('relationship').properties[relationType.properties];
      actor[relationType.field].push(relationObject);

    }
  })
  actor.number_of_movies_played_in = actor.movies.length;
  return actor;
}

const insert = (object) => {
  return SESSION
    .run(`CREATE (actor:Actor {
        id: ${object.id},
        lname: '${object.lname}',
        fname: "${object.fname}",
        mname: "${object.mname}",
        gender: "${object.gender}",
        number: "${object.number}"
      }) RETURN actor`)
    .then(r => manyActors(r)[0]);
}

const insertMovieRole = (actorId, movieId, roles) => {
  // FIXME: Do we actually want to be able to store multiple roles for movie->actor relation?
  roles = roles == undefined ? [] : decodeURIComponent(roles).replace(/["'()]/g,"");

  return SESSION
    .run(`MATCH (actor:Actor) WHERE actor.id = ${actorId}
          MATCH (movie:Movie) WHERE movie.id = ${movieId}
          CREATE (actor)-[:ACTED_IN {roles:['${roles}']}]->(movie)
          RETURN actor`)
    .then(r => r);
}

const find = (identifier) => {
  return SESSION
    .run(`MATCH (actor:Actor {id: ${identifier}})-[relationship]-(n) RETURN actor, relationship, n`)
    .then(r => singleActor(r));
}

const findAll = () => {
  return SESSION
    .run(`MATCH (actor:Actor) RETURN actor`)
    .then(r => manyActors(r));
};

const deleteAll = () => {
  return SESSION
    .run(`MATCH (actor:Actor) DETACH DELETE actor`)
    .then(r => r);
}

module.exports = {
  insert,
  find,
  findAll,
  deleteAll,
  insertMovieRole
};
