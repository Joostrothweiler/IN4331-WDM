const ORM = require('../../orm');
const Models = require('../../neo/models');

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
  delete where.order;

  delete where.from;
  delete where.to;

  // let order = `asc ${orderby}, n.year`;
  let order = [
    [ 'actor.id', 'asc'],
    [ `n.${orderby}`, dir]
  ];

  if (id == null) return ORM.findAll('neo', 'actors', { where, page, perPage, order, dir })
      .then(results => {
        res.json(results);
      }).catch(next);

  where.id = id;

  return ORM.find('neo', 'actors', { id } )
    .then(result => {
      res.json(result);
    }).catch(next);
};
