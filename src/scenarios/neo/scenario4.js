const ORM = require('../../orm');
const Models = require('../../pg/models');

module.exports = (req, res, next) => {
  const { id } = req.params;
  const { page = 0, perPage = 10, genre, from, to } = req.query;

  let where = Object.assign({}, req.query, {
    year: {
      from: parseInt(from) || 1,
      to: parseInt(to != null ? to : (new Date()).getFullYear())
    },
    genre: genre ? genre : undefined
  });

  delete where.page;
  delete where.perPage;
  delete where.dir;
  delete where.orderby;
  delete where.from;
  delete where.to;

  if (id == null) return ORM.findAll('neo', 'movies', { where, page, perPage })
      // .then(results => results.map(stats))
      .then(results => {
        res.json(results);
      }).catch(next);

  return ORM.findAll('neo', 'movies', { where, page, perPage })
    // .then(stats)
    .then(result => {
      res.json(result);
    }).catch(next);
};
