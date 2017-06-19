const ORM = require('../orm');
const Models = require('../pg/models');

module.exports = (req, res, next) => {
  const { database, id } = req.params;
  const { page = 0, perPage = 10, dir = 'asc', orderby = 'year', title, from, to } = req.query;

  let where = Object.assign({}, req.query, {
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
    {
      type: 'movies',
      attributes: [ 'title', 'year' ]
    },
    // { type: 'actors' },
    // { type: 'genres' },
    // { type: 'keywords' },
  ];

  const order =[
    [ Models.Movie, orderby, dir ]
  ];


  if (id == null) return ORM.findAll(database, 'actors', { where, page, perPage, order, dir, include })
      .then(results => {
        res.json(results);
      }).catch(next);

  where.id = id;

  return ORM.find(database, 'actors', { where, order, include })
    .then(result => {
      res.json(result);
    }).catch(next);
};
