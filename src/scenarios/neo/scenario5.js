const ORM = require('../../orm');
const Models = require('../../neo/models');

function stats(g) {
  let {
    id,
    genre,
    movies: { length: movies_count }
  } = g;

  return {
    id,
    genre,
    movies_count
  };
}

module.exports = (req, res, next) => {
  const { id } = req.params;
  const { page = 0, perPage = 10, dir = 'asc', orderby = 'year', title, from, to } = req.query;

  let where = Object.assign({}, req.query, {
    year: {
      from: parseInt(from) || 1,
      to: parseInt(to != null ? to : (new Date()).getFullYear())
    },
  });

  if (id == null) return ORM.findAll('neo', 'genres', { where, page, perPage, dir })
      .then(results => results.map(stats))
      .then(results => {
        res.json(results);
      }).catch(next);

  return ORM.find('neo', 'genres', { id })
    .then(stats)
    .then(result => {
      res.json(result);
    }).catch(next);
};
