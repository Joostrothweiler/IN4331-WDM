const { MONGO_URL } = require('../config');
const mongoose = require('mongoose');

const CONNECTION = mongoose.connect(MONGO_URL).connection;

module.exports = {
    CONNECTION
};
