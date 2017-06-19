const Models = require('./models');

const typeMap = {
  movies: 'Movie',
  actors: 'Actor',
  genres: 'Genre',
  keywords: 'Keyword',
  series: 'Series',
  aka_titles: 'AKATitles',
  aka_names: 'AKANames',
};

const assocMap = {
  'movies': [ 'actors', 'genres', /*'series', 'aka_titles', 'keywords'*/ ],
  'actors': [ 'movies', 'aka_names', 'series' ],
  'genres': [ 'movies', 'series' ],
  'keywords': [ 'movies', 'series' ],
  'series': [ 'movies', 'actors', 'genres' ,'keywords' ],
  'aka_titles': [ 'movies' ],
  'aka_names': [ 'actors' ],
};

// actors: actors, movies, aka_names, series
// movies: genres, series, aka_titles, keywords

function _getModel(type) {
  if (!(type in typeMap)) throw new Error(`'${type}' is not a valid model name.`);
  let key = typeMap[type];
  return Models[key];
}

function _mapIncludes(type) {
  if (!(type in assocMap)) throw new Error(`'${type}' is not a valid association name.`);
  return assocMap[type].map(assoc => {
    return {
      model: _getModel(assoc)
    };
  });
}

async function find(type, id) {
  console.log(`Finding ${type} by id ${id}`);

  const Model = _getModel(type);
  return Model.findOne({
    where: { id: id},
    include: _mapIncludes(type)
  });
}

async function findAll(type, where = { }, page = 0, perPage = 10, orderby = 'id', dir = 'asc') {
  console.log(`Finding ${type} page ${page} per ${perPage}, ordered by ${orderby} in direction ${dir}`);

  const Model = _getModel(type);
  return Model.findAll({
    where: Object.keys(where).length ? where : undefined,
    order: [[orderby, dir]],
    offset: page * perPage,
    limit: perPage,
    include: _mapIncludes(type)
  });
}

module.exports = {
  find,
  findAll
};
