const Sequelize = require('sequelize');
const connection = require('../connection');

const Movie = connection.define('movies', {
  id: {
    field: 'idmovies',
    primaryKey: true,
    type: Sequelize.STRING
  },
  title: Sequelize.STRING,
  year: Sequelize.INTEGER,
  number: Sequelize.INTEGER,
  type: Sequelize.STRING,
  location: Sequelize.STRING,
  language: Sequelize.STRING
}, { timestamps: false });

module.exports = Movie;
