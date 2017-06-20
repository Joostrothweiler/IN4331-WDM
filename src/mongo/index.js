const Models = require('./models');
const _ = require('lodash');

const typeMap = {
  movies: 'Movie',
  actors: 'Actor',
}

function _getModel(type) {
  if (!(type in typeMap)) throw new Error(`'${type}' is not a valid model name.`);
  let key = typeMap[type];
  return Models[key];
}

async function insertModel(type, object) {
  console.log(`Inserting ${type} into Mongo:`, object);
  object._id = object.id;

  const Model = _getModel(type);
  return Model.create(object);
}

async function insertMovieRole(actorId, movieId, role) {
  const character = role ? decodeURIComponent(role).replace(/["'()]/g,"") : null;

  let movie = await find('movies', { id: movieId });
  let actor = await find('actors', { id: actorId });

  if (!_.some(actor.movie_ids, { _id: movie._id})) {
    actor.movie_ids.push({ _id: movie._id, 'role': character });
    movie.actor_ids.push({ _id: actor._id, 'role': character });
    await actor.save();
    await movie.save();
  }
}

async function find(type, options) {
  const Model = _getModel(type);
  const { where, include } = options;
  console.log(`Finding one Mongo ${type} based on ${where}`)
  const res =  Model.findOne(where);
  return include != null ? res.populate(include) : res;
}

async function findAll(type, where = {}, page = 0, perPage = 10, orderby, groupby, dir, include) {
  const order = (orderby === 'id' || !orderby ) ? '_id' : orderby;
  const direction = dir === 'asc' ? 1 : dir === 'desc' ? -1 : 1;
  const amount = Number.isInteger(perPage) ? perPage : Number.parseInt(perPage);
  const skip = Number.isInteger(page) ? page : Number.parseInt(page);

  const { year, yearTo } = where;
  if (yearTo && year) {
    where.year = { $gte: year, $lte: yearTo}
    delete where.yearTo
  }

  console.log(`Finding ${type} page ${skip} per ${amount} orderby ${order} ${direction} with include:`, include);
  const Model = _getModel(type);
  const res = Model.find(where).sort([[order, direction]]).skip(skip).limit(amount);

  return include != null ? res.populate(include) : res;
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
