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

async function find(type, options) {
  const Model = _getModel(type);
  const { id } = options;
  console.log(`Finding ${type} with identifier = ${id}`);
  return Model.find(id);
}

const processWhere = (where) => {
  if(where.hasOwnProperty('year')) {
    if(!where.year.hasOwnProperty('from')) {
      where.year.from = 1
    }
    if(!where.year.hasOwnProperty('to')) {
      where.year.to = (new Date()).getFullYear()
    }
  }
  else {
    where = { year: { from : 1, to : (new Date()).getFullYear() } }
  }
  return where
}

async function findAll(type, where, page = 0, perPage = 10, order = [['n.id', 'asc']], groupby, dir = 'asc', include) {
  console.log(`Finding ${type} page ${page} per ${perPage} order by ${order}`);
  where = processWhere(where)
  const Model = _getModel(type);
  return Model.findAll(where, page, perPage, order, dir);
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
