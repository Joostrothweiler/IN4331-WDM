const Movies = require('./models/movies');
const connection = require('./connection');


async function findAll(req, type, page = 0, perPage = 10) {
  console.log(`Finding ${type} page ${page} per ${perPage}`);

  return Movies.findAll(connection.getSession(req));
}

module.exports = {
  findAll
};
