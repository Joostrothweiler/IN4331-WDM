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
  object._id = object.id

  console.log(`Inserting ${type}`);
  const Model = _getModel(type);
  return Model.create(object);
}

async function insertMovieRole(actorId, movieId, roles) {
  // FIXME: Do we actually want to be able to store multiple roles for movie->actor relation?
  roles = roles == undefined ? [] : decodeURIComponent(roles).replace(/["'()]/g,"");

  let movie = await find('movies', movieId);
  let actor = await find('actors', actorId);

  // TODO: Should this also be inserted into movies?
  actor.movie_ids.push({ _id: movie._id, 'roles': [roles]});
  return await actor.save();
}

async function find(type, id) {
  const Model = _getModel(type);
  return Model.findOne({'_id' : id});
}

async function findAll(type, where, page = 0, perPage = 10, orderby, dir) {
  orderby = (orderby == 'id' || orderby == undefined) ? '_id' : orderby;

  console.log(`Finding ${type} page ${page} per ${perPage} orderby ${orderby} ${dir}`);
  const Model = _getModel(type);
  console.log(perPage)
  return Model.find().sort([[orderby, dir]]).skip(page).limit(perPage);
}

async function deleteAll(type, page = 0, perPage = 10) {
  console.log(`Deleting ${type} page ${page} per ${perPage}`);
  const Model = _getModel(type);
  return Model.remove({});
}

module.exports = {
  findAll,
  find,
  insertModel,
  insertMovieRole,
  deleteAll
};
