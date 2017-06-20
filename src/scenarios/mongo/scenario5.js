const ORM = require('../../orm');

function stats(movies) {
  return Object.entries(movies.reduce((memo, movie) => {
    let { genres } = movie;

    [].concat(genres).forEach(genre => {
      genre in memo ? memo[genre]++ : memo[genre] = 1;
    });

    return memo;
  }, {})).map(([genre, movies_count]) => {
    return {
      genre,
      movies_count
    }
  });
}


module.exports = (req, res, next) => {
  const { id } = req.params;
  const { page = 0, perPage = 1000000, genre, from, to } = req.query;

  let where = Object.assign({}, req.query, {
    genres: {
      $in: genre,
    },
    year: {
      $gte: parseInt(from) || 1,
      $lte: parseInt(to != null ? to : (new Date()).getFullYear())
    }
  });

  if (genre == null) delete where.genres;
  delete where.page;
  delete where.perPage;

  delete where.genre;
  delete where.from;
  delete where.to;

  if (id == null) return ORM.findAll('mongo', 'movies', { where, page, perPage, order: 'year' })
      .then(stats)
      .then(results => {
        res.json(results);
      }).catch(next);

  return ORM.findAll('mongo', 'movies', { where: { genres: id }, page, perPage, order: 'year' })
    .then(stats)
    .then(result => {
      res.json(result);
    }).catch(next);
};
