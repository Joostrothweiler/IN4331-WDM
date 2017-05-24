const Sequelize = require('sequelize');
const connection = require('../connection');

const Actor = connection.define('actors', {
  id: {
    field: 'idactors',
    primaryKey: true,
    type: Sequelize.STRING
  },
  lname: Sequelize.STRING,
  fname: Sequelize.STRING,
  mname: Sequelize.STRING,
  gender: Sequelize.INTEGER,
  number: Sequelize.INTEGER,
}, { timestamps: false });


module.exports = Actor;
