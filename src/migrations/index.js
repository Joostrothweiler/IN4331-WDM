const API_HELPERS = require('./api-helpers');

async function migrate(deleteFirst = false) {
  if(deleteFirst) {
    await API_HELPERS.deleteModels('mongo', 'movies');
    await API_HELPERS.deleteModels('mongo', 'actors');
    console.log('Deleted mongo models');

    await API_HELPERS.deleteModels('neo', 'movies');
    await API_HELPERS.deleteModels('neo', 'actors');
    console.log('Deleted neo models');
  }

  API_HELPERS.migrateMovies('mongo');
  API_HELPERS.migrateMovies('neo');
}

// removeOld();
migrate(false).catch(err => console.error(err));
