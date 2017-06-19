const Helpers = require('./helpers');

async function migrateMovies(migrationDb) {
  let actors_inserted_ids = [];
  let genres_inserted_ids = [];

  const perPage = 300;
  const numberOfPages = 1000;

  for (let page = 0; page < numberOfPages; page++) {
    console.log('Fetching next');
    let movies = await Helpers.fetchMovies('pg', page, perPage);
    console.log(`Processing page ${page}/${numberOfPages} with ${perPage} movies per page.`);

    for (let i = 0; i < movies.length; i++) {
      let movie = movies[i];
      // Check if not already inserted
      let nextMovie = await Helpers.fetchModel(migrationDb, 'movies', movie.id);

      if(nextMovie == undefined || nextMovie == null || nextMovie.id == undefined) {
        console.log(`Inserting ${movie.id} for ${migrationDb}`);

        let actors = movie.actors;
        let genres = movie.genres;

        console.log(actors.length)
        console.log(genres.length)

        // Send only the plain movie object with request.
        delete movie.actors;
        delete movie.genres;

        await Helpers.insertModel(migrationDb, 'movies', movie);

        // Insert actors
        for (let key in actors) {
          const actor = actors[key];
          if (actors_inserted_ids.indexOf(actor.id) > -1) {
            // Not inserting actor with id = actor.id - Already in database
          } else {
            let actorExists = await Helpers.fetchModel(migrationDb, 'actors', actor.id);
            if(actorExists == undefined || actorExists == null || actorExists.id == undefined) {
              await Helpers.insertModel(migrationDb, 'actors', actor);
              actors_inserted_ids.push(actor.id);
            }
          }
          await Helpers.insertRole(migrationDb, actor.id, movie.id, actor.acted_in.character);
        }

        // Insert genres
        for (let key in genres) {
          const genre = genres[key];
          if (genres_inserted_ids.indexOf(genre.id) > -1) {
            // Not inserting genre with id = genre.id - Already in database
          } else {
            let genreExists = await Helpers.fetchModel(migrationDb, 'genres', genre.id);
            if(genreExists == undefined || genreExists == null || genreExists.id == undefined) {
              await Helpers.insertModel(migrationDb, 'genres', genre);
              genres_inserted_ids.push(genre.id);
            }
          }
          await Helpers.insertGenre(migrationDb, movie.id, genre.id);
        }
      }
    }
  }
  console.log('done')
}

module.exports = {
  migrateMovies
}
