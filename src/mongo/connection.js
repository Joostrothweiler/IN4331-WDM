const { MONGO_URL } = require('../config');
const mongoose = require('mongoose');

var CONNECTION = CONNECTION || mongoose.connect(MONGO_URL).connection;

module.exports = {
    CONNECTION
};
