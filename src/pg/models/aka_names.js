const Sequelize = require('sequelize');
const connection = require('../connection');

const AKANames = connection.define('aka_names', {
  id: {
    field: 'idaka_names',
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  idactors: Sequelize.INTEGER,
  name: Sequelize.STRING,
}, {
  tableName: 'aka_names',
  timestamps: false,
  freezeTableName: true
});

module.exports = AKANames;
