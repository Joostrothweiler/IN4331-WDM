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

async function find(type, id) {
  let results = await findAll(type, { id });
  return results[0];
}

async function findAll(type, where = { }, page = 0, perPage = 10, orderby = 'id', dir = 'asc') {
  console.log(`Finding ${type} page ${page} per ${perPage}, ordered by ${orderby} in direction ${dir}`);

  const Model = _getModel(type);
  return Model.findAll({
    where: Object.keys(where).length ? where : undefined,
    order: [[orderby, dir]],
    offset: page * perPage,
    limit: perPage
  });
}

module.exports = {
  find,
  findAll
};
