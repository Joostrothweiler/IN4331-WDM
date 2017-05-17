const Sequelize = require('sequelize');
const { POSTGRES_URL } = require('../config');

const sequelize = new Sequelize(Config.POSTGRES_URL);

sequelize.authenticate()
  .then(err => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  });

module.exports = sequelize;
