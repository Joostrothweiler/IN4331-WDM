const Sequelize = require('sequelize');
const connection = require('../connection');

const Keyword = connection.define('keywords', {
  id: {
    field: 'idkeywords',
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  keyword: Sequelize.STRING,
}, {
  tableName: 'keywords',
  timestamps: false,
  freezeTableName: true
});

module.exports = Keyword;
