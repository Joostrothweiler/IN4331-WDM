const mongoose = require('mongoose');
const { CONNECTION } = require('../connection.js');
const Schema = mongoose.Schema;

const Movies = require('./movies');

// Create a schema for short actor statistics
const actorInfo = new Schema({
  _id: Number, // We already know the id so do not let mongo create it.
  lname: String,
  fname: String,
  mname: String,
  gender: String,
  number : Number
});

// Create a schema for detailed actor statistics
const fullActorInfo = new Schema({
  actorInfo: actorInfo,
  movie_ids: [
    {
      movie: Movies.movieInfo
    }
  ]
  // movie_ids: [
  //   {
  //     _id: { type: mongoose.Schema.Types.Number, ref: 'Movies' },
  //     title: String,
  //     year: Number,
  //     // TODO: Do we need the roles in this scheme?
  //     roles: [ String ],
  //   }
  // ],
});

// The schema is useless so far we need to create a model using it
const Actor = mongoose.model('Actor', fullActorInfo);

module.exports = Actor;
