const mongoose = require('mongoose');
const { CONNECTION } = require('../connection.js');
const Schema = mongoose.Schema;

const Movies = require('./movies');

// Create a schema
const actorSchema = new Schema({
  _id: Number, // We already know the id so do not let mongo create it.
  lname: String,
  fname: String,
  mname: String,
  gender: String,
  number: Number,
  movie_ids: [
    {
      _id: { type: mongoose.Schema.Types.Number, ref: 'Movie' },
      role: String
    }
  ]
});

// The schema is useless so far we need to create a model using it
const Actor = mongoose.model('Actor', actorSchema);

module.exports = Actor;
