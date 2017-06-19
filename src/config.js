require('dotenv').load({ silent: true });

const {
  SERVER_PORT = 3000,
  POSTGRES_DBNAME = 'wdm',
  POSTGRES_URL = 'postgres://postgres:postgres@pg-master:5432/',
  NEO_URL = 'bolt://neo4j',
  BASE_URL = 'http://localhost:2222',
  MONGO_URL = 'mongo1,mongo2,mongo3'
} = process.env;

module.exports = {
    SERVER_PORT,
    POSTGRES_URL,
    POSTGRES_DBNAME,
    NEO_URL,
    BASE_URL,
    MONGO_URL
};
