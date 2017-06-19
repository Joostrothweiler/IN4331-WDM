const mongoose = require('mongoose');
const { CONNECTION } = require('../connection.js');
const Schema = mongoose.Schema;

// Create a schema
const genreSchema = new Schema({
  _id: Number, // We already know the id so do not let mongo create it.
  name: String,
});

const Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre;
