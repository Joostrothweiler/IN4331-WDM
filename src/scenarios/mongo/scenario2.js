const ORM = require('../../orm');
const Models = require('../../mongo/models');

module.exports = (req, res, next) => {
  const { id } = req.params;
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

  const include = {
    path: 'movie_ids._id',
    select: ['title', 'year']
  };

  // const order = 'id';
  const order =[
    [ orderby, dir ]
  ];


  if (id == null) return ORM.findAll('mongo', 'actors', { where, page, perPage, order: 'id', dir, include })
      .then(results => {
        res.json(results);
      }).catch(next);

  where.id = id;

  return ORM.find('mongo', 'actors', { where, order, include })
    .then(result => {
      res.json(result);
    }).catch(next);
};
