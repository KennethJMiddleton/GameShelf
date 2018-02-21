'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const gameSchema = mongoose.Schema({
    name : String,
    minPlayers : Number,
    maxPlayers : Number,
    time : Number,
    age : Number,
    coop : Boolean,
    dice : Boolean,
    deckBuilding : Boolean,
    bluffing : Boolean,   
    tokenMovement : Boolean,
    tokenPlacement : Boolean,
    setCollecting : Boolean,
    party : Boolean,
    trivia : Boolean,
    expansion : Boolean
  });

  gameSchema.methods.serialize = function() {
    return {
        id: this.id,
        name : this.name,
        minPlayers : this.minPlayers,
        maxPlayers : this.maxPlayers,
        time : this.time,
        age : this.age,
        coop : this.coop, 
        dice : this.dice,
        deckBuilding : this.deckBuilding,
        bluffing : this.bluffing,
        tokenMovement : this.tokenMovement,
        tokenPlacement : this.tokenPlacement,
        setCollecting : this.setCollecting,
        party : this.party,
        trivia : this.trivia,
        expansion : this.expansion,         
    };
  }

const Game = mongoose.model('Game', gameSchema);

module.exports = {Game};