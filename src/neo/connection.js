const { NEO_URL } = require('../config');
const neo4j = require('neo4j-driver').v1;

const driver = neo4j.driver(NEO_URL, neo4j.auth.basic('', ''));

const getSession = (context) => {
  if(context.neo4jSession) {
    return context.neo4jSession;
  }
  else {
    context.neo4jSession = driver.session();
    return context.neo4jSession;
  }
};

module.exports = {
  getSession
};
