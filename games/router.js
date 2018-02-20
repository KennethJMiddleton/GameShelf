'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');

const {Game} = require('./models');

const config = require('../config');
const router = express.Router();

router.get('/', (req, res) => {
    Game
      .find()
      .then(game => {res.json(
        game.map(item => item.serialize())
      )})
      .catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'})
      });
  });

  router.post('/', (req, res) => {
    const requiredFields = ['name', 'minPlayers', 'maxPlayers', 'time', 'age', 'coop', 'dice', 'deckBuilding', 'bluffing', 'tokenMovement', 'tokenPlacement', 'setCollecting', 'party', 'trivia', 'expansion'];
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`;
        console.error(message);
        return res.status(400).send(message);
      }
    }
  
    Game
      .create({
        name : req.body.name,
        minPlayers : req.body.minPlayers,
        maxPlayers : req.body.maxPlayers,
        time : req.body.time,
        age : req.body.age,
        coop : req.body.coop,
        dice : req.body.dice,
        deckBuilding : req.body.deckBuilding,
        bluffing : req.body.bluffing,
        tokenMovement : req.body.tokenMovement,
        tokenPlacement : req.body.tokenPlacement,
        setCollecting : req.body.setCollecting,
        party : req.body.party,
        trivia : req.body.trivia,
        expansion : req.body.expansion,
      })
      .then(post => res.status(201).json(post.serialize()))
      .catch(err => {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      });
  });

module.exports = {router};