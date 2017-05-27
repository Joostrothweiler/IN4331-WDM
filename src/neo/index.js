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

async function find(req, type, id) {
  console.log(`Finding ${type} with id = ${id}`);
  let results = await findAll(req, type, { id });
  return results[0];
}

async function findAll(req, type, page = 0, perPage = 10) {
  console.log(`Finding ${type} page ${page} per ${perPage}`);

  const Model = _getModel(type);
  return Model.findAll(connection.getSession(req));
}

module.exports = {
  findAll,
  find
};
