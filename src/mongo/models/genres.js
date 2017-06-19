const mongoose = require('mongoose');
const { CONNECTION } = require('../connection.js');
const Schema = mongoose.Schema;

const Actors = require('./actors');
const Movies = require('./movies');

// Create a schema for genre exploration
const genreSchema = new Schema({
  _id: Number, // We already know the id so do not let mongo create it.
  label: String,
  actor_ids: [
      {
        // TODO: Unresolved variable?
        actor: Actors.actorInfo
      }
  ]
  // actor_ids: [
  //   {
  //     _id: { type: mongoose.Schema.Types.Number, ref: 'Actors' },
  //     fname: String,
  //     lname: String,
  //     gender: String,
  //     movie_ids: [
  //       {
  //         _id: { type: mongoose.Schema.Types.Number, ref: 'Movies' },
  //         title: String,
  //         year: Number
  //       }
  //     ]
  //   }
  // ]
});

const Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre;
