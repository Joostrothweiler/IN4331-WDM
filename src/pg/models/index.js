const connection = require('../connection');

const Movie = require('./movie');
const Actor = require('./actor');

const ActedIn = require('./acted_in');

Actor.belongsToMany(Movie, { through: ActedIn, foreignKey: 'idactors', otherkey: 'idmovies', constraints: false });
Movie.belongsToMany(Actor, { through: ActedIn, foreignKey: 'idmovies', otherkey: 'idactors', constraints: false });

module.exports = {
  ActedIn,
  Movie,
  Actor
}
