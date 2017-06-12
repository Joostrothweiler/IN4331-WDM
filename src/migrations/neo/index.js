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

async function insertNeoRole(actor, movie) {
  return rp.post({
    url: BASE_URL + `/neo/actors/${actor}/movies/${movie}`,
    json: true
  })
  console.log('inserted role')
}

async function fetchPgMovie(id) {
  return rp.get({
    url: BASE_URL + `/pg/movies/${id}`,
    json: true
  })
}

async function migrateMovies() {
  await deleteNeoModels('movies');
  await deleteNeoModels('actors');

  for (let i = 1; i < 30; i++) {
    let movie = await fetchPgMovie(i);
    let actors = movie.actors;
    delete movie.actors

    console.log(i)

    await insertNeoModel('movies', movie);

    for (let key in actors) {
      const actor = actors[key];
      await insertNeoModel('actors', actor);
      insertNeoRole(actor.id, movie.id);
    }
  }

  console.log('done')
}

migrateMovies();
