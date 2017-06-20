const ORM = require('../../orm');

module.exports = (req, res, next) => {
  const { id } = req.params;
  const { page = 0, perPage = 10, dir = 'asc', orderby = 'year',  title, from, to } = req.query;

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

  delete where.from;
  delete where.to;

  if (id == null) return ORM.findAll('neo', 'movies', { where, page, perPage, orderby, dir })
      .then(results => {
        res.json(results);
      }).catch(next);

  return ORM.find('neo', 'movies', { id } )
    .then(result => {
      res.json(result);
    }).catch(next);
};
