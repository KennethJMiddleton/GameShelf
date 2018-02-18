'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const shelfSchema = mongoose.Schema({
  games : [String]
});

shelfSchema.methods.serialize = function() {
  return {
    id: this.id,
    games: this.games
  };
}

const Shelf = mongoose.model('Shelf', shelfSchema);

module.exports = {Shelf};