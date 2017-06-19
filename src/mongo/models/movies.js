const mongoose = require('mongoose');
const { CONNECTION } = require('../connection.js');
const Schema = mongoose.Schema;

const Actors = require('./actors');

// Create a schema for <movie info>
const movieInfo = new Schema({
  _id: Number,
  title: String,
  year: Number
});

// Create a schema for <full movie info>
const fullMovieInfo = new Schema({
    movieInfo: movieInfo,
    series: String,
    genre_ids: [
      {
        _id: Number,
        label: String
      }
    ],
    keywords: [ String ],
    actors_ids: [
      {
        actor: Actors.actorInfo,
        role: String
      }
    ]
    // actor_ids: [
    //   {
    //     _id: { type: mongoose.Schema.Types.Number, ref: 'Actors' },
    //     lname: [ String ],
    //     fname: [ String ],
    //     gender: [ String ],
    //     roles: [ String ]
    //   }
    // ]
});

// The schema is useless so far we need to create a model using it
const Movie = mongoose.model('Movie', fullMovieInfo);

module.exports = Movie;