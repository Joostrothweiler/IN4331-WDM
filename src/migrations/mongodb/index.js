const API_HELPERS = require('../api-helpers');


async function migrateMovies() {
  let actors_inserted_ids = [];
  let genres_inserted_ids = [];

  const perPage = 300;
  const numberOfPages = 1000;

  for (let page = 0; page < numberOfPages; page++) {
    console.log('Fetching next');
    let movies = await API_HELPERS.fetchMovies('pg', page, perPage);
    console.log(`Processing page ${page}/${numberOfPages} with ${perPage} movies per page.`);

    for (let i = 0; i < movies.length; i++) {
      let movie = movies[i];
      // Check if not already inserted
      let neoMovie = await API_HELPERS.fetchMovie('mongo', movie.id);

      if(neoMovie == undefined) {
        let actors = movie.actors;
        // let genres = movie.genres;

        // Send only the plain movie object with request.
        delete movie.actors;
        delete movie.genres;

        await API_HELPERS.insertModel('mongo', 'movies', movie);

        for (let key in actors) {
          const actor = actors[key];

          if (actors_inserted_ids.indexOf(actor.id) > -1) {
            // Not inserting actor with id = actor.id - Already in database
          } else {
            // Actor not yet in database - insert
            await API_HELPERS.insertModel('mongo', 'actors', actor);
            actors_inserted_ids.push(actor.id);
          }

          let res = await API_HELPERS.insertRole('mongo', actor.id, movie.id, actor.acted_in.character);
        }
        // Repeat loop for genres.
      }
    }
  }
  console.log('done')
}

migrateMovies();
