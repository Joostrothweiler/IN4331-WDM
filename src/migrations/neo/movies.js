const request = require('request');
const rp = require('request-promise');
const {BASE_URL} = require('../../config');

async function deleteNeoModels(type) {
  return rp.del({
    url: BASE_URL + `/neo/${type}`,
    json: true
  });
}

async function insertNeoModel(type, model) {
  return rp.post({
    url: BASE_URL + `/neo/${type}`,
    form: model,
    json: true
  })
  console.log('inserted model')
}

async function insertNeoRole(actor, movie, roles) {
  let urlEnd = roles == null ? '' :  `?roles="${encodeURIComponent(roles)}"`;
  return rp.post({
    url: BASE_URL + `/neo/actors/${actor}/movies/${movie}` + urlEnd,
    json: true
  })
  console.log('inserted role')
}

async function fetchMovies(db, page, perPage) {
  return rp.get({
    url: BASE_URL + `/${db}/movies?page=${page}&perPage=${perPage}`,
    json: true
  })
}

async function fetchMovie(db, id) {
  return rp.get({
    url: BASE_URL + `/${db}/movies/${id}`,
    json: true
  })
}

async function migrateMovies() {
  let actors_inserted_ids = [];
  let genres_inserted_ids = [];

  const perPage = 300;
  const numberOfPages = 1000;

  for (let page = 0; page < numberOfPages; page++) {
    console.log('Fetching next');
    let movies = await fetchMovies('pg', page, perPage);
    console.log(`Processing page ${page}/${numberOfPages} with ${perPage} movies per page.`);

    for (let i = 0; i < movies.length; i++) {
      let movie = movies[i];
      // Check if not already inserted
      let neoMovie = await fetchMovie('neo', movie.id);

      if(neoMovie == undefined) {
        let actors = movie.actors;
        // let genres = movie.genres;

        // Send only the plain movie object with request.
        delete movie.actors;
        delete movie.genres;

        await insertNeoModel('movies', movie);

        for (let key in actors) {
          const actor = actors[key];

          if (actors_inserted_ids.indexOf(actor.id) > -1) {
            // Not inserting actor with id = actor.id - Already in database
          } else {
            // Actor not yet in database - insert
            await insertNeoModel('actors', actor);
            actors_inserted_ids.push(actor.id);
          }

          let res = await insertNeoRole(actor.id, movie.id, actor.acted_in.character);
        }
        // Repeat loop for genres.
      }
    }
  }
  console.log('done')
}

migrateMovies();
