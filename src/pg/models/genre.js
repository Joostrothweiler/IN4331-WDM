const Sequelize = require('sequelize');
const connection = require('../connection');

const Genre = connection.define('genres', {
  id: {
    field: 'idgenres',
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  genre: Sequelize.STRING,
}, {
  tableName: 'genres',
  timestamps: false,
  freezeTableName: true
});

module.exports = Genre;
