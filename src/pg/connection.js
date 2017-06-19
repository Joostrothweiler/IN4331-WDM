
const Sequelize = require('sequelize');
const { POSTGRES_MASTER_URL, POSTGRES_SLAVES_URL, POSTGRES_DBNAME } = require('../config');

const sequelize = new Sequelize(`${POSTGRES_MASTER_URL}${POSTGRES_DBNAME}`, {
  replication: {
    read: POSTGRES_SLAVES_URL,
    write: POSTGRES_MASTER_URL,
  }
});

sequelize.authenticate()
  .then(err => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  });

module.exports = sequelize;
