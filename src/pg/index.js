const connection = require('./connection');
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
  'movies': [ 'actors', /*'series', 'aka_titles', 'keywords'*/ ],
  // 'actors': [ 'movies', 'aka_names', 'series' ],
  // 'genres': [ 'movies', 'series' ],
  // 'keywords': [ 'movies', 'series' ],
  // 'series': [ 'movies', 'actors', 'genres' ,'keywords' ],
  // 'aka_titles': [ 'movies' ],
  // 'aka_names': [ 'actors' ],
};

// actors: actors, movies, aka_names, series
// movies: genres, series, aka_titles, keywords

function stats(actor) {
  let { fname, mname, lname, movies: { length: movies_count } } = actor;
  let name = [ fname, mname, lname ].filter(x => x).join(' ');

  return {
    name,
    movies_count
  };
}

function _getModel(type) {
  if (!(type in typeMap)) throw new Error(`'${type}' is not a valid model name.`);
  let key = typeMap[type];
  return Models[key];
}

function _mapIncludes(type) {
  if (!(type in assocMap)) return []; //throw new Error(`'${type}' is not a valid association name.`);
  return assocMap[type].map(assoc => {
    return {
      model: _getModel(assoc)
    };
  });
}

async function find(type, options) {
  const Model = _getModel(type);
  const { where, order, include } = options;
  console.log(`Finding ${type} by ${where} ordered by ${order} including ${include}`);

  return Model.findOne({
    where,
    order,
    include: include != null ? [].concat(include).map(i => Object.assign({}, i, { model: _getModel(i.type) })) : _mapIncludes(type)
  });
}

async function findAll(type, where = { }, page = 0, perPage = 10, order = [], groupby, dir = 'asc', include = null) {
  console.log(`Finding ${type} page ${page} per ${perPage}, ordered by ${order} in direction ${dir}`);

  const Model = _getModel(type);
  return Model.findAll({
    where: Object.keys(where).length ? where : undefined,
    order,
    group: groupby ? groupby : undefined,
    offset: page * perPage,
    limit: perPage,
    include: include != null ? [].concat(include).map(i => Object.assign({}, i, { model: _getModel(i.type) })) : _mapIncludes(type)
  });
}

module.exports = {
  find,
  findAll
};
