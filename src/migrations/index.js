const { deleteModels } = require('./helpers');
const Mongo = require('./mongo');

async function migrate(deleteFirst = false) {
  if(deleteFirst) {
    await deleteModels('mongo', 'movies');
    await deleteModels('mongo', 'actors');
    console.log('Deleted mongo models');

    // await API_HELPERS.deleteModels('neo', 'movies');
    // await API_HELPERS.deleteModels('neo', 'actors');
    // console.log('Deleted neo models');
  }

  Mongo.migrateMovies('mongo');
  // API_HELPERS.migrateMovies('neo');
}

// removeOld();
migrate(true);
