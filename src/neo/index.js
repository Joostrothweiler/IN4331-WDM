const Models = require('./models');

const typeMap = {
  movies: 'Movie',
  actors: 'Actor',
  genres: 'Genre',
}

function _getModel(type) {
  console.log(type)
  if (!(type in typeMap)) throw new Error(`'${type}' is not a valid model name.`);
  let key = typeMap[type];
  return Models[key];
}

async function insertModel(type, object) {
  console.log(`Inserting ${type}`);
  const Model = _getModel(type);
  return Model.insert(object);
}

async function insertMovieRole(actorId, movieId, roles) {
  console.log(`Actor: ${actorId}. Movie: ${movieId}`);
  const Model = _getModel('actors');
  return Model.insertMovieRole(actorId, movieId, roles);
}

async function insertGenre(movieId, genreId) {
  console.log(`Genre: ${genreId}, Movie: ${movieId}`);
  const Model = _getModel('movies');
  return Model.insertGenre(movieId, genreId);
}

async function find(type, identifier) {
  console.log(`Finding ${type} with identifier = ${identifier}`);
  const Model = _getModel(type);
  return Model.find(identifier);
}

async function findAll(type, where, page = 0, perPage = 10, orderby, dir) {
  console.log(`Finding ${type} page ${page} per ${perPage}`);
  const Model = _getModel(type);
  return Model.findAll(where, page, perPage, orderby, dir);
}

async function deleteAll(type, page = 0, perPage = 10) {
  console.log(`Deleting ${type} page ${page} per ${perPage}`);

  const Model = _getModel(type);
  return Model.deleteAll();
}

module.exports = {
  insertModel,
  insertGenre,
  findAll,
  find,
  deleteAll,
  insertMovieRole
};
