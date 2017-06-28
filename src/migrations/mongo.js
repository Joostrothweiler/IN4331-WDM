const Helpers = require('./helpers');

let actors_inserted_ids = {
};

async function migrateActor(actor, movie) {
  // console.log('Migrating actor', actor, movie);
  if (actor.id in actors_inserted_ids) return Promise.resolve();

  const actorExists = undefined != await Helpers.fetchModel('mongo', 'actors', actor.id);
  if (!actorExists ) {
    await Helpers.insertModel('mongo', 'actors', actor);
    actors_inserted_ids[actor.id] = true;
  }

  if (actor.acted_in.character == null) return Promise.resolve();
  return Helpers.insertRole('mongo', actor.id, movie.id, actor.acted_in.character);
}

async function migrateMovie(movie) {
  // Check if not already inserted
  console.log('Migrating', movie.id);

  let actors = movie.actors;
  // Send only the plain movie object with request.
  delete movie.actors;

  movie.genres = movie.genres.map(genre => genre.genre);

  await Helpers.insertModel('mongo', 'movies', movie);

  return Promise.all(actors.map(actor => migrateActor(actor, movie)));
}

async function migrateMovies() {
  let actors_inserted_ids = [];
  let genres_inserted_ids = [];

  const perPage = 30;
  const numberOfPages = 10000;

  for (let page = 0; page < numberOfPages; page++) {
    console.log('Fetching next');
    let movies = await Helpers.fetchMovies('pg', page, perPage);
    console.log(`Processing page ${page}/${numberOfPages} with ${perPage} movies per page.`);

    await Promise.all(movies.map(migrateMovie));
  }
  console.log('done')
}

module.exports = {
  migrateMovies
}
