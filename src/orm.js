const PG = require('./pg');
const NEO = require('./neo');
const MONGO = require('./mongo')

const databaseMap = {
  'pg': PG,
  'neo': NEO,
  'mongo': MONGO
}

function _getDatabase(db) {
  if (!(db in databaseMap)) throw new Error(`'${db}' is not a valid database name.`);

  return databaseMap[db];
}

async function findAll(db, type, options) {
  const database = _getDatabase(db);
  const { where, page, perPage, orderby, dir } = options;

  return database.findAll(type, where, page, perPage, orderby, dir);
}

async function deleteAll(db, type, options) {
  const database = _getDatabase(db);
  const { where, page, perPage } = options;

  return database.deleteAll(type, where, page, perPage);
}

async function find(db, type, options) {
  const database = _getDatabase(db);
  const { id, tail } = options;

  return database.find(type, id, tail);
}

async function insertModel(db, type, options) {
  const database = _getDatabase(db);
  const { model } = options;

  return database.insertModel(type, model);
}

async function insertMovieRole(db, actorId, movieId, roles) {
  const database = _getDatabase(db);

  return database.insertMovieRole(actorId, movieId, roles);
}

module.exports = {
  findAll,
  deleteAll,
  find,
  insertModel,
  insertMovieRole
}
