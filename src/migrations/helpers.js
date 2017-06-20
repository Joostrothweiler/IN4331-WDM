const request = require('request');
const rp = require('request-promise');

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
  let urlEnd = roles ? `?role="${encodeURIComponent(roles)}"` : '';
  return rp.post({
    url: BASE_URL + `/${db}/actors/${actor}/movies/${movie}` + urlEnd,
    json: true
  });
}

async function insertGenre(db, movieId, genreId) {
  return rp.post({
    url: BASE_URL + `/${db}/movies/${movieId}/genres/${genreId}`,
    json: true
  });
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

module.exports = {
  deleteModels,
  insertModel,
  insertRole,
  fetchMovies,
  fetchModel,
  insertGenre
}
