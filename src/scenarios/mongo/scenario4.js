const ORM = require('../../orm');

module.exports = (req, res, next) => {
  const { id } = req.params;
  const { page = 0, perPage = 10, genre, from, to } = req.query;

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
      .then(results => {
        res.json(results);
      }).catch(next);

  return ORM.findAll('mongo', 'movies', { where: { genres: id }, page, perPage, order: 'year' })
    .then(result => {
      res.json(result);
    }).catch(next);
};
