const Sequelize = require('sequelize');
const connection = require('../connection');

const AKATitles = connection.define('aka_titles', {
  id: {
    field: 'idaka_titles',
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  idmovies: Sequelize.INTEGER,
  title: Sequelize.STRING,
  location: Sequelize.STRING,
  year: Sequelize.INTEGER,
}, {
  tableName: 'aka_titles',
  timestamps: false,
  freezeTableName: true
});

module.exports = AKATitles;
