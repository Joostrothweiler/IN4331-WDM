const ORM = require('../../orm');

module.exports = (req, res, next) => {
  const { id } = req.params;
  const { page = 0, perPage = 10, title, from, to } = req.query;

  let where = Object.assign({}, req.query, {
    title: new RegExp(`.*${title}.*`, 'i'),
    year: {
      $gte: from || 1,
      $lte: to != null ? to : (new Date()).getFullYear()
    }
  });

  if (title == null) delete where.title;
  if (title == null) delete where.type;
  delete where.page;
  delete where.perPage;
  delete where.dir;
  delete where.orderby;

  delete where.from;
  delete where.to;


  if (id == null) return ORM.findAll('mongo', 'movies', { where, page, perPage, order: 'year' })
      .then(results => {
        res.json(results);
      }).catch(next);

  return ORM.find('mongo', 'movies', { where: { _id: id } })
    .then(result => {
      res.json(result);
    }).catch(next);
};
