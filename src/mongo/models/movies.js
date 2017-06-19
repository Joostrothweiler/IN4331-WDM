const mongoose = require('mongoose');
const { CONNECTION } = require('../connection.js');
const Schema = mongoose.Schema;

// Create a schema
const movieSchema = new Schema({
  _id: Number, // We already know the id so do not let mongo create it.
  title: String,
  year: Number,
  genre_ids: [ Number ]
});

// The schema is useless so far we need to create a model using it
const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie
