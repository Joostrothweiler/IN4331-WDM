const Sequelize = require('sequelize');
const connection = require('../connection');

const ActedIn = connection.define('acted_in', {
  id: {
    field: 'idacted_in',
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  idmovies: Sequelize.INTEGER,
  idseries: Sequelize.INTEGER,
  idactors: Sequelize.INTEGER,
  character: Sequelize.STRING,
  billing_position: Sequelize.INTEGER,
}, {
  tableName: 'acted_in',
  timestamps: false,
  freezeTableName: true
});

module.exports = ActedIn;
