const request = require('request');
const rp = require('request-promise');

const PQueue = require('p-queue');

const queue = new PQueue({
  concurrency: 8
});

const { BASE_URL } = require('../config');

async function deleteModels(db, type) {
  if(db == 'pg') {
    console.log('Not removing from PG!');
  }
  else {
    return rp.del({
      url: BASE_URL + `/${db}/${type}`,
      json: true
    });
  }
}

async function insertModel(db, type, model) {
  return rp.post({
    url: BASE_URL + `/${db}/${type}`,
    form: model,
    json: true
  })
  console.log('inserted model')
}

async function insertRole(db, actor, movie, roles) {
  let urlEnd = roles == null ? '' :  `?roles="${encodeURIComponent(roles)}"`;
  return rp.post({
    url: BASE_URL + `/${db}/actors/${actor}/movies/${movie}` + urlEnd,
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

async function fetchModel(db, type, id) {
  return rp.get({
    url: BASE_URL + `/${db}/${type}/${id}`,
    json: true
  })
}

async function migrateMovies(migrationDb) {
  let actors_inserted_ids = [];
  let genres_inserted_ids = [];

  const perPage = 10;
  const numberOfPages = 30000;

  for (let page = 0; page < numberOfPages; page++) {
    console.log('Fetching next');
    queue.add(async () => {

      let movies = await fetchMovies('pg', page, perPage);
      console.log(`Processing page ${page}/${numberOfPages} with ${perPage} movies per page.`);

      return Promise.all(movies.map(async (m) => fetchModel(migrationDb, 'movies', m.id)))
        .then(async (movies) => {
          return Promise.all(movies.map(async (movie) => {
            let actors = movie.actors;

            // Send only the plain movie object with request.
            delete movie.actors;
            delete movie.genres;

            await insertModel(migrationDb, 'movies', movie);

            return Promise.all(actors.map(async (a) => {
              if (!(actors_inserted_ids.indexOf(actor.id) > -1)) {
                const actor = await fetchModel(migrationDb, 'actors', actor.id);
                await insertModel(migrationDb, 'actors', actor);
                actors_inserted_ids.push(actor.id);
                return insertRole(migrationDb, actor.id, movie.id, actor.acted_in.character);
              }
            }));
          }));
        });

          // for (let key in actors) {
          //   const actor = actors[key];
          //
          //   // Not inserting actor with id = actor.id - Already in database
          //   if (!(actors_inserted_ids.indexOf(actor.id) > -1)) {
          //     let actorExists = await fetchModel(migrationDb, 'actors', actor.id);
          //     if(actorExists == undefined || actorExists == null) {
          //       await insertModel(migrationDb, 'actors', actor);
          //       actors_inserted_ids.push(actor.id);
          //     }
          //   }
          //
          //   return insertRole(migrationDb, actor.id, movie.id, actor.acted_in.character);
          // }
        // });

      // for (let i = 0; i < movies.length; i++) {
      //   let movie = movies[i];
      //   console.log(`${migrationDb}: migrating movie ${i}`);
      //   // Check if not already inserted
      //   let nextMovie = await fetchModel(migrationDb, 'movies', movie.id);
      //
      //   if(nextMovie == undefined || nextMovie == null) {
      //     let actors = movie.actors;
      //
      //     // Send only the plain movie object with request.
      //     delete movie.actors;
      //     delete movie.genres;
      //
      //     await insertModel(migrationDb, 'movies', movie);
      //
      //     for (let key in actors) {
      //       const actor = actors[key];
      //
      //       if (actors_inserted_ids.indexOf(actor.id) > -1) {
      //         // Not inserting actor with id = actor.id - Already in database
      //       } else {
      //         let actorExists = await fetchModel(migrationDb, 'actors', actor.id);
      //         if(actorExists == undefined || actorExists == null) {
      //           await insertModel(migrationDb, 'actors', actor);
      //           actors_inserted_ids.push(actor.id);
      //         }
      //       }
      //
      //       let res = await insertRole(migrationDb, actor.id, movie.id, actor.acted_in.character);
      //     }
      //     // Repeat loop for genres.
      //   }
      // }
    });
  }
  console.log('done')
}

module.exports = {
  deleteModels,
  migrateMovies
}
