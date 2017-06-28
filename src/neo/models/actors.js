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

// TODO: Return normal error message saying no actors found.
// FIXME: Return empty object when nothing found...
// FIXME: Extract to helper function for all relations.
const manyActors = (results) => {
  let actors = [];
  let actor = {};

  results.records.map(record => {
    let recordActor = new Actor(record.get('actor'), false);

    if(recordActor.id != actor.id) {
      if(actor.id != undefined) {
        actors.push(actor);
      }
      actor = recordActor;
    }

    if(record.keys[1] == 'relationship') {
      relationType = relationMap[record.get('relationship').type]
      actor[relationType.field] = actor[relationType.field] || [];

      let relationObject = new relationType.model(record.get('n'));
      relationObject[relationType.properties] = record.get('relationship').properties[relationType.properties];
      actor[relationType.field].push(relationObject);
    }
  })
  actors.push(actor)
  return actors
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
  // Right now we use arrays to store roles.
  roles = roles;
  // roles = roles == undefined ? [] : decodeURIComponent(roles).replace(/["'()]/g,"");

  return SESSION
    .run(`MATCH (actor:Actor) WHERE actor.id = ${actorId}
          MATCH (movie:Movie) WHERE movie.id = ${movieId}
          CREATE (actor)-[:ACTED_IN {roles:["${roles}"]}]->(movie)
          RETURN actor`)
    .then(r => r);
}

const find = (identifier) => {
  return SESSION
    .run(`MATCH (actor:Actor {id: ${identifier}})-[relationship]-(n) RETURN actor, relationship, n  ORDER BY n.year DESC`)
    .then(r => manyActors(r)[0]);
}

function _reduceOrder(order) {
  return order.map(([ orderby, dir ]) => {
    return `${orderby} ${dir}`;
  }).join(', ');
}

const findAll = (where, page, perPage, order, dir) => {
  return SESSION
    .run(`MATCH (actor:Actor) RETURN actor.id SKIP ${page*perPage} LIMIT ${perPage}`)
    .then(r => {
      ids = r.records.map(a => a.get('actor.id').low)
      return SESSION
        .run(`MATCH (actor:Actor)-[relationship]-(n) WHERE actor.id IN [${ids}] RETURN actor, relationship, n ORDER BY actor.id, ${_reduceOrder(order)}`)
        .then(r => manyActors(r))
    });
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
