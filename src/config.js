require('dotenv').load({ silent: true });

const {
  SERVER_PORT = 3000,
  POSTGRES_URL = 'postgres://postgres:postgres@postgres:5432/wdm',
} = process.env;

module.exports = {
    SERVER_PORT,
    POSTGRES_URL,
};
