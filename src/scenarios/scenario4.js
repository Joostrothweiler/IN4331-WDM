const ORM = require('../orm');
const Models = require('../pg/models');


module.exports = (req, res, next) => {
  const { database, id } = req.params;
  const { page = 0, perPage = 1000, genre, from, to } = req.query;

  let where = Object.assign({}, req.query, {
    year: {
      $gt: from || 1,
      $lt: to != null ? to : (new Date()).getFullYear()
    }
  });

  delete where.page;
  delete where.perPage;
  delete where.dir;
  delete where.orderby;

  delete where.genre;
  delete where.from;

  const include = {
    type: 'genres',
    // offset: page * perPage,
    // limit: perPage,
    where: genre ? {
      genre
    } : id ? { id } : {}
  };

  const order = [
    [ 'year', 'asc' ],
    [ 'title', 'asc' ]
  ];

  if (id == null) return ORM.findAll(database, 'movies', { where, page, perPage, order, include })
      // .then(results => results.map(stats))
      .then(results => {
        res.json(results);
      }).catch(next);

  return ORM.findAll(database, 'movies', { where, page, perPage, order, include })
    // .then(stats)
    .then(result => {
      res.json(result);
    }).catch(next);
};