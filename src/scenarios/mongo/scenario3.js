const ORM = require('../../orm');

function stats(actor) {
  let { id, fname, mname, lname
    , movie_ids: { length: movies_count }
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
  const { page = 0, perPage = 10 } = req.query;

  let where = Object.assign({}, req.query);
  delete where.page;
  delete where.perPage;

  if (id == null) return ORM.findAll('mongo', 'actors', { where, page, perPage })
      .then(results => results.map(stats))
      .then(results => {
        res.json(results);
      }).catch(next);

  return ORM.find('mongo', 'actors', { where: { _id: id } })
    .then(stats)
    .then(result => {
      res.json(result);
    }).catch(next);
};
