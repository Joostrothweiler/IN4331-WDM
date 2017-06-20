const Helpers = require('./helpers');

async function migrateMovies(migrationDb) {
  let actors_inserted_ids = [];
  let genres_inserted_ids = [];

  const perPage = 30;
  const numberOfPages = 1000;

  for (let page = 0; page < numberOfPages; page++) {
    console.log('Fetching next');
    let movies = await Helpers.fetchMovies('pg', page, perPage);
    console.log(`Processing page ${page}/${numberOfPages} with ${perPage} movies per page.`);

    for (let i = 0; i < movies.length; i++) {
      let movie = movies[i];
      console.log(`${migrationDb}: migrating movie ${i}`);
      // Check if not already inserted
      console.log('TESTING', movie.id);
      let nextMovie = await Helpers.fetchModel(migrationDb, 'movies', movie.id);

      if(nextMovie == undefined || nextMovie == null) {
        let actors = movie.actors;

        // Send only the plain movie object with request.
        delete movie.actors;
        movie.genres = movie.genres.map(genre => genre.genre);
        console.log('Blabla:', movie);


        await Helpers.insertModel(migrationDb, 'movies', movie);

        for (let key in actors) {
          const actor = actors[key];

          if (actors_inserted_ids.indexOf(actor.id) > -1) {
            // Not inserting actor with id = actor.id - Already in database
          } else {
            const actorExists = await Helpers.fetchModel(migrationDb, 'actors', actor.id);
            if (!actorExists ) {
              await Helpers.insertModel(migrationDb, 'actors', actor);
              actors_inserted_ids.push(actor.id);
            }
          }

          let res = await Helpers.insertRole(migrationDb, actor.id, movie.id, actor.acted_in.character);
        }
        // Repeat loop for genres.
      }
    }
  }
  console.log('done')
}

module.exports = {
  migrateMovies
}
