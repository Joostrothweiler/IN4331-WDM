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

async function insertModel(type, object) {
  console.log(`Inserting ${type}`);
  const Model = _getModel(type);
  return Model.insert(object);
}

// TODO: Optional to retrieve by id instead - but then we need to insert it from postgres.
async function find(type, identifier) {
  console.log(`Finding ${type} with identifier = ${identifier}`);
  const Model = _getModel(type);
  return Model.find(identifier);
}

async function findAll(type, page = 0, perPage = 10) {
  console.log(`Finding ${type} page ${page} per ${perPage}`);

  const Model = _getModel(type);
  return Model.findAll();
}

async function deleteAll(type, page = 0, perPage = 10) {
  console.log(`Deleting ${type} page ${page} per ${perPage}`);

  const Model = _getModel(type);
  return Model.deleteAll();
}

module.exports = {
  insertModel,
  findAll,
  find,
  deleteAll
};
