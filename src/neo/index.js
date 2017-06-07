const connection = require('./connection');
const Models = require('./models');

const typeMap = {
  movies: 'Movie',
  actors: 'Actor'
}

function _getModel(type) {
  if (!(type in typeMap)) throw new Error(`'${type}' is not a valid model name.`);
  let key = typeMap[type];
  return Models[key];
}

async function insertModel(req, type, object) {
  console.log(`Inserting ${type}`);
  const Model = _getModel(type);
  return Model.insert(connection.getSession(req), object);
}

// TODO: Optional to retrieve by id instead - but then we need to insert it from postgres.
async function find(req, type, title) {
  console.log(`Finding ${type} with title = ${title}`);
  const Model = _getModel(type);
  return Model.find(connection.getSession(req), title);
}

async function findAll(req, type, page = 0, perPage = 10) {
  console.log(`Finding ${type} page ${page} per ${perPage}`);

  const Model = _getModel(type);
  return Model.findAll(connection.getSession(req));
}

module.exports = {
  insertModel,
  findAll,
  find
};
