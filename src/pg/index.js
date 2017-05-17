const Models = require('./models');

async function findAll(type, page = 0, perPage = 10) {
  console.log(`Finding ${type} page ${page} per ${perPage}`);

  return Models[type].findAll({
    offset: page * perPage,
    limit: perPage
  })
}

module.exports = {
  findAll
};
