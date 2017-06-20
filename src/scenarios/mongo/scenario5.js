const ORM = require('../../orm');

module.exports = (req, res, next) => {
  const { id } = req.params;
  const { page = 0, perPage = 1000, dir = 'asc', orderby = 'id', genre, from, to } = req.query;

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

  const sql = `
  SELECT *
  FROM "genres"
  LEFT JOIN (
      SELECT "genres"."idgenres", "genre", COUNT("genre") as "movies_count"
      FROM "genres"
      LEFT JOIN "movies_genres" ON "movies_genres"."idgenres" = "genres"."idgenres"
      LEFT JOIN "movies" ON "movies_genres"."idmovies" = "movies"."idmovies"
      WHERE "movies"."year" >= ${from || 1} AND "movies"."year" <= ${to || (new Date()).getFullYear()}
      GROUP BY "genre", "genres"."idgenres"
  ) as temp
  ON "genres"."idgenres" = "temp"."idgenres"
  LIMIT ${perPage}
  OFFSET ${page * perPage};
`

  return connection.query(sql, { type: connection.QueryTypes.SELECT})
    .then(results => {
      res.json(results);
    }).catch(next);
};
