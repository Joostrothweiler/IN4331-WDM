const request = require('request');
const rp = require('request-promise');

const { BASE_URL } = require('../config');

async function deleteModels(db, type) {
  return rp.del({
    url: BASE_URL + `/${db}/${type}`,
    json: true
  });
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

async function fetchMovie(db, id) {
  return rp.get({
    url: BASE_URL + `/${db}/movies/${id}`,
    json: true
  })
}

module.exports = {
  deleteModels,
  insertModel,
  insertRole,
  fetchMovies,
  fetchMovie
}
