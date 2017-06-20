const { deleteModels } = require('./helpers');
const Mongo = require('./mongo');
const Neo = require('./neo');

async function migrate(deleteFirst = false) {
  if(deleteFirst) {
    await deleteModels('mongo', 'movies');
    await deleteModels('mongo', 'actors');
    console.log('Deleted mongo models');

    await deleteModels('neo', 'movies');
    await deleteModels('neo', 'actors');
    await deleteModels('neo', 'genres');
    console.log('Deleted neo models');
  }

  // Mongo.migrateMovies('mongo');
  Neo.migrateMovies('neo');
}

migrate(true);
