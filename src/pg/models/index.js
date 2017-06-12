const connection = require('../connection');

const Movie = require('./movie');
const Actor = require('./actor');
const Genre = require('./genre');
const Series = require('./series');

const ActedIn = require('./acted_in');
const MoviesGenres = require('./movies_genres');
const AKATitles = require('./aka_titles');

Actor.belongsToMany(Movie, { through: ActedIn, foreignKey: 'idactors', otherkey: 'idmovies', constraints: false });
Movie.belongsToMany(Actor, { through: ActedIn, foreignKey: 'idmovies', otherkey: 'idactors', constraints: false });

Movie.belongsToMany(Genre, { through: MoviesGenres, foreignKey: 'idmovies', otherkey: 'idgenres', constraints: false });
Genre.belongsToMany(Movie, { through: MoviesGenres, foreignKey: 'idgenres', otherkey: 'idmovies', constraints: false });

Movie.hasMany(Series, { foreignKey: 'idmovies', otherkey: 'idseries' });
Series.belongsTo(Movie, { foreignKey: 'idmovies', otherkey: 'idseries' });

Movie.hasMany(AKATitles, { foreignKey: 'idmovies', otherkey: 'idaka_titles' });
AKATitles.belongsTo(Movie, { foreignKey: 'idmovies', otherkey: 'idaka_titles' });

module.exports = {
  Movie,
  Actor,
  Genre,
  Series,

  ActedIn,
  AKATitles,
}
