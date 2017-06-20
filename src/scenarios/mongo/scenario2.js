const ORM = require('../../orm');
const Models = require('../../mongo/models');

module.exports = (req, res, next) => {
  const { id } = req.params;
  const { page = 0, perPage = 10 } = req.query;

  let where = Object.assign({}, req.query, {});

  delete where.page;
  delete where.perPage;

  const include = {
    path: 'movie_ids._id',
    select: ['title', 'year']
  };

  if (id == null) return ORM.findAll('mongo', 'actors', { where, page, perPage, dir, include })
      .then(results => {
        res.json(results);
      }).catch(next);

  where.id = id;

  return ORM.find('mongo', 'actors', { where: { _id: id }, include })
    .then(result => {
      res.json(result);
    }).catch(next);
};
