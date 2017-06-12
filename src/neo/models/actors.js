const { SESSION } = require('../connection.js');
const Actor = require('./neo4j/actor.js');


const manyActors = (results) => {
  return results.records.map(r => new Actor(r.get("actor")))
}

const singleActor = (results) => {
  return manyActors(results)[0];
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
    .then(r => singleActor(r));
}

const insertMovieRole = (actorId, movieId) => {
  return SESSION
    .run(`MATCH (actor:Actor) WHERE actor.id = ${actorId}
          MATCH (movie:Movie) WHERE movie.id = ${movieId}
          CREATE (actor)-[:ACTED_IN]->(movie)
          RETURN actor`)
    .then(r => singleActor(r));
}

const find = (identifier) => {
  return SESSION
    .run(`MATCH (actor:Actor) WHERE actor.id = ${identifier} RETURN actor`)
    .then(r => singleActor(r));

    // Fuzzy matching - see if we want to do this later.
    // return SESSION
    //   .run(`MATCH (actor:Actor) WHERE
    //     actor.id = ${identifier} OR
    //     actor.fname =~ "(?i).*${identifier}.*" OR
    //     actor.lname =~ "(?i).*${identifier}.*" RETURN actor`)
    //   .then(r => manyActors(r));
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
  deleteAll
};
