const Sequelize = require('sequelize');
const connection = require('../connection');

const MoviesGenres = connection.define('movies_genres', {
  id: {
    field: 'idmovies_genres',
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  idmovies: Sequelize.INTEGER,
  idgenres: Sequelize.INTEGER,
  idseries: Sequelize.INTEGER
}, {
  tableName: 'movies_genres',
  timestamps: false,
  freezeTableName: true
});

module.exports = MoviesGenres;
