const Sequelize = require('sequelize');
const connection = require('../connection');

const MoviesKeywords = connection.define('movies_keywords', {
  id: {
    field: 'idmovies_keywords',
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  idmovies: Sequelize.INTEGER,
  idkeywords: Sequelize.INTEGER,
  idseries: Sequelize.INTEGER
}, {
  tableName: 'movies_keywords',
  timestamps: false,
  freezeTableName: true
});

module.exports = MoviesKeywords;
