const Models = require('./models');

const typeMap = {
  movies: 'Movie',
  actors: 'Actor',
  genres: 'Genre'
}

function _getModel(type) {
  if (!(type in typeMap)) throw new Error(`'${type}' is not a valid model name.`);
  let key = typeMap[type];
  return Models[key];
}

async function insertModel(type, object) {
  console.log(`Inserting ${type}`);
  const Model = _getModel(type);
  return Model.create(object);
}

const insertMovieRole = (actorId, movieId, roles) => {
  roles = roles == undefined ? [] : decodeURIComponent(roles).replace(/["'()]/g,"");

  return SESSION
    .run(`MATCH (actor:Actor) WHERE actor.id = ${actorId}
          MATCH (movie:Movie) WHERE movie.id = ${movieId}
          CREATE (actor)-[:ACTED_IN {roles:['${roles}']}]->(movie)
          RETURN actor`)
    .then(r => r);
}

async function find(type, id) {
  const Model = _getModel(type);
  return Model.findOne({'_id' : id});
}

async function findAll(type, page = 0, perPage = 10) {
  console.log(`Finding ${type} page ${page} per ${perPage}`);
  const Model = _getModel(type);
  return Model.find({});
}

async function deleteAll(type, page = 0, perPage = 10) {
  console.log(`Deleting ${type} page ${page} per ${perPage}`);
  const Model = _getModel(type);
  return Model.remove({});
}

module.exports = {
  findAll,
  find,
  insertModel
};
