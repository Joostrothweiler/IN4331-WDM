const connection = require('../connection');

const Movie = require('./movie');
const Actor = require('./actor');
const Genre = require('./genre');

const ActedIn = require('./acted_in');
const MoviesGenres = require('./movies_genres');

Actor.belongsToMany(Movie, { through: ActedIn, foreignKey: 'idactors', otherkey: 'idmovies', constraints: false });
Movie.belongsToMany(Actor, { through: ActedIn, foreignKey: 'idmovies', otherkey: 'idactors', constraints: false });

Movie.belongsToMany(Genre, { through: MoviesGenres, foreignKey: 'idmovies', otherkey: 'idgenres', constraints: false });
Genre.belongsToMany(Movie, { through: MoviesGenres, foreignKey: 'idgenres', otherkey: 'idmovies', constraints: false });

module.exports = {
  Movie,
  Actor,
  Genre,

  ActedIn,
}
