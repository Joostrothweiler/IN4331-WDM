const connection = require('../connection');

const Movie = require('./movie');
const Actor = require('./actor');
const Genre = require('./genre');
const Series = require('./series');
const Keyword = require('./keyword');

const ActedIn = require('./acted_in');
const MoviesGenres = require('./movies_genres');
const MoviesKeywords = require('./movies_keywords');
const AKATitles = require('./aka_titles');
const AKANames = require('./aka_names');

Actor.belongsToMany(Movie, { through: ActedIn, foreignKey: 'idactors', otherkey: 'idmovies', constraints: false });
Movie.belongsToMany(Actor, { through: ActedIn, foreignKey: 'idmovies', otherkey: 'idactors', constraints: false });

Series.belongsToMany(Actor, { through: ActedIn, foreignKey: 'idseries', otherkey: 'idactors', constraints: false });
Actor.belongsToMany(Series, { through: ActedIn, foreignKey: 'idactors', otherkey: 'idseries', constraints: false });

Movie.belongsToMany(Genre, { through: MoviesGenres, foreignKey: 'idmovies', otherkey: 'idgenres', constraints: false });
Genre.belongsToMany(Movie, { through: MoviesGenres, foreignKey: 'idgenres', otherkey: 'idmovies', constraints: false });

Series.belongsToMany(Genre, { through: MoviesGenres, foreignKey: 'idseries', otherkey: 'idgenres', constraints: false });
Genre.belongsToMany(Series, { through: MoviesGenres, foreignKey: 'idgenres', otherkey: 'idseries', constraints: false });

Movie.hasMany(Series, { foreignKey: 'idmovies', otherkey: 'idseries' });
Series.belongsTo(Movie, { foreignKey: 'idmovies', otherkey: 'idseries' });

Movie.hasMany(AKATitles, { foreignKey: 'idmovies', otherkey: 'idaka_titles' });
AKATitles.belongsTo(Movie, { foreignKey: 'idmovies', otherkey: 'idaka_titles' });

Actor.hasMany(AKANames, { foreignKey: 'idactors', otherkey: 'idaka_names' });
AKANames.belongsTo(Actor, { foreignKey: 'idactors', otherkey: 'idaka_names' });

Movie.belongsToMany(Keyword, { through: MoviesKeywords, foreignKey: 'idmovies', otherkey: 'idkeywords' });
Keyword.belongsToMany(Movie, { through: MoviesKeywords, foreignKey: 'idmovies', otherkey: 'idkeywords' });

Series.belongsToMany(Keyword, { through: MoviesKeywords, foreignKey: 'idseries', otherkey: 'idkeywords', constraints: false });
Keyword.belongsToMany(Series, { through: MoviesKeywords, foreignKey: 'idkeywords', otherkey: 'idseries', constraints: false });

module.exports = {
  Movie,
  Actor,
  Genre,
  Series,
  Keyword,

  ActedIn,
  AKATitles,
  AKANames,
}
