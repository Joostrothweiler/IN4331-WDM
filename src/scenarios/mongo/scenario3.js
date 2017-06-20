const ORM = require('../../orm');

function stats(actor) {
  let { id, fname, mname, lname
    , movies: { length: movies_count }
   } = actor;
  let name = [ fname, mname, lname ].filter(x => x).join(' ');

  return {
    id,
    name,
    movies_count
  };
}

module.exports = (req, res, next) => {
  const { id } = req.params;
  const { page = 0, perPage = 1000, dir = 'asc', orderby = 'id'} = req.query;

  let where = Object.assign({}, req.query);
  delete where.page;
  delete where.perPage;
  delete where.dir;
  delete where.orderby;

  const include = {
    type: 'movies'
  };

  if (id == null) return ORM.findAll('mongo', 'actors', { where, page, perPage, orderby, dir, include })
      .then(results => results.map(stats))
      .then(results => {
        res.json(results);
      }).catch(next);

  return ORM.find('mongo', 'actors', { id, include })
    .then(stats)
    .then(result => {
      res.json(result);
    }).catch(next);
};
