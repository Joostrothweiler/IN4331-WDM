const ORM = require('../orm');

module.exports = (req, res, next) => {
  const { database, id } = req.params;
  const { page = 0, perPage = 10, title, from, to } = req.query;

  let where = Object.assign({}, req.query, {
    title: {
      $like: `%${title}`,
    },
    year: {
      $gte: from || 1,
      $lte: to != null ? to : (new Date()).getFullYear()
    },
    type: 3
  });

  if (title == null) delete where.title;
  if (title == null) delete where.type;
  delete where.page;
  delete where.perPage;
  delete where.dir;
  delete where.orderby;

  delete where.from;
  delete where.to;

  const include = [
    { type: 'series' },
    { type: 'actors' },
    { type: 'genres' },
    { type: 'keywords' },
  ]

  if (id == null) return ORM.findAll(database, 'movies', { where, page, perPage, include })
      .then(results => {
        res.json(results);
      }).catch(next);

  return ORM.find(database, 'movies', { id, include })
    .then(result => {
      res.json(result);
    }).catch(next);
};
