const { NEO_URL } = require('../config');
const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver(NEO_URL, neo4j.auth.basic('', ''));

var SESSION = SESSION || driver.session();

module.exports = {
    SESSION
};
