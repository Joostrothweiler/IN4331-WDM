const { MONGO_URL } = require('../config');
const mongoose = require('mongoose');

const CONNECTION = mongoose.connect(MONGO_URL).connection;

mongoose.set('debug', true);

module.exports = {
    CONNECTION
};
