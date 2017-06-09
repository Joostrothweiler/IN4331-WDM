const { SESSION } = require('../connection.js');
const Actor = require('./neo4j/actor.js');


const manyActors = (results) => {
  return results.records.map(r => new Actor(r.get('actor')))
}

const insert = (object) => {
  return SESSION
    .run(`CREATE (actor:Actor {
        id: '${object.id}',
        lname: '${object.lname}',
        fname: '${object.fname}',
        mname: '${object.mname}',
        gender: '${object.gender}',
        number: '${object.number}'
      }) RETURN actor`)
    .then(r => manyActors(r));
}

// Fuzzy matching title based on fname, lname, parts of those and lower case.
const find = (identifier) => {
  return SESSION
    .run(`MATCH (actor:Actor) WHERE
      actor.id = ${identifier} OR
      actor.fname =~ '(?i).*${identifier}.*' OR
      actor.lname =~ '(?i).*${identifier}.*' RETURN actor`)
    .then(r => manyActors(r));
}

// get all movies
const findAll = () => {
  return SESSION
    .run('MATCH (actor:Actor) RETURN actor')
    .then(r => manyActors(r));
};

module.exports = {
  insert,
  find,
  findAll
};
