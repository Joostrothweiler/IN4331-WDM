const Sequelize = require('sequelize');
const connection = require('../connection');

const Series = connection.define('series', {
  id: {
    field: 'idseries',
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  idmovies: Sequelize.INTEGER,
  name: Sequelize.STRING,
  season: Sequelize.INTEGER,
  number: Sequelize.INTEGER
}, {
  tableName: 'series',
  timestamps: false,
  freezeTableName: true
});

module.exports = Series;
