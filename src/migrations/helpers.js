const request = require('request');
const fetch = require('node-fetch');
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
    let url = BASE_URL + `/${db}/${type}`;
    return queue.add( () => fetch(url, {
      method: 'delete'
    }).then(response => response.json()) );
  }
}

async function insertModel(db, type, model) {
  let url = BASE_URL + `/${db}/${type}`;
  // console.log(`Posting to ${url} with:`, model);
  return queue.add( () => fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(model)
  }) );
}

async function insertRole(db, actor, movie, roles) {
  let url = BASE_URL + `/${db}/actors/${actor}/movies/${movie}`;
  console.log(`Inserting role to ${url}`, roles);
  return queue.add( () => fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ role: roles })
  }) );
}

async function insertGenre(db, movieId, genreId) {
  let url = BASE_URL + `/${db}/movies/${movieId}/genres/${genreId}`;
  return queue.add( () => fetch(url, {
    method: 'post'
  }) );
}

async function fetchMovies(db, page, perPage) {
  let url = BASE_URL + `/${db}/movies?page=${page}&perPage=${perPage}`;
  return queue.add( () => fetch(url, {
    method: 'get'
  }).then(response => response.json()) );
}

async function fetchModel(db, type, id) {
  let url = BASE_URL + `/${db}/${type}/${id}`;
  return queue.add( () => fetch(url, {
    method: 'get'
  }).then(response => response.json()) );
}

module.exports = {
  deleteModels,
  insertModel,
  insertRole,
  fetchMovies,
  fetchModel,
  insertGenre
}
