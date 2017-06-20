const ORM = require('../../orm');

module.exports = (req, res, next) => {
  const { id } = req.params;
  const { page = 0, perPage = 1000, genre, from, to } = req.query;

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
  delete where.dir;
  delete where.orderby;

  delete where.genre;
  delete where.from;
  delete where.to;

  let include;
  // const include = {
  //   type: 'genres',
  //   // offset: page * perPage,
  //   // limit: perPage,
  //   where: genre ? {
  //     genre
  //   } : id ? { id } : {}
  // };

  // const order = [
  //   [ 'year', 'asc' ],
  //   [ 'title', 'asc' ]
  // ];

  if (id == null) return ORM.findAll('mongo', 'movies', { where, page, perPage, order: 'year', include })
      // .then(results => results.map(stats))
      .then(results => {
        res.json(results);
      }).catch(next);

  return ORM.findAll('mongo', 'movies', { where: { genres: id }, page, perPage, order: 'year', include })
    // .then(stats)
    .then(result => {
      res.json(result);
    }).catch(next);
};
