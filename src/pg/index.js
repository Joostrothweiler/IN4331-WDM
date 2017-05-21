const Models = require('./models');

const typeMap = {
  movies: 'Movie'
}

function _getModel(type) {
  if (!(type in typeMap)) throw new Error(`'${type}' is not a valid model name.`);
  let key = typeMap[type];
  return Models[key];
}

async function findAll(req, type, page = 0, perPage = 10) {
  console.log(`Finding ${type} page ${page} per ${perPage}`);

  const Model = _getModel(type);
  return Model.findAll({
    offset: page * perPage,
    limit: perPage
  });
}

module.exports = {
  findAll
};
