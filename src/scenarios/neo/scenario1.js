const ORM = require('../../orm');

module.exports = (req, res, next) => {
  const { id } = req.params;
  const { page = 0, perPage = 10, dir = 'asc', orderby = 'year',  title, from, to } = req.query;

  let where = Object.assign({}, req.query)

  if (id == null) return ORM.findAll('neo', 'movies', { where, page, perPage, orderby, dir })
      .then(results => {
        res.json(results);
      }).catch(next);

  return ORM.find('neo', 'movies', { id } )
    .then(result => {
      res.json(result);
    }).catch(next);
};
