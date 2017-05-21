require('dotenv').load({ silent: true });

const {
  SERVER_PORT = 3000,
  POSTGRES_URL = 'postgres://postgres:postgres@postgres:5432/postgres',
  NEO_URL = 'bolt://neo4j'
} = process.env;

module.exports = {
    SERVER_PORT,
    POSTGRES_URL,
    NEO_URL
};
