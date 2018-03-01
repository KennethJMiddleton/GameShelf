'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');

const {Shelf} = require('./models');
const {Game} = require('../games');

const config = require('../config');
const router = express.Router();

router.get('/', (req, res) => {
  Shelf
    .find()
    .then(shelf => {res.json(
      shelf.map(game => game.serialize())
    )})
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'})
    });
});

router.get('/:id', (req, res) => {
  Shelf
    .findById(req.params.id)
    .then(shelf => {
      return Game
      .where('_id')
      .in(shelf.games);
    })
    .then(games => {
      const list = games.map(game => game.serialize());
      res.json(list);
    });
});

router.post('/', (req, res) => {
  Shelf
    .create({
      games: []
    })
    .then(shelf => res.status(201).json(shelf.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

router.put('/:shelfId/:gameId', (req,res) =>{
  Shelf
    .findById(req.params.shelfId)
    .then(shelf => {shelf.games.push(req.params.gameId); return shelf.save();})
    .then(response => res.status(201).json(response))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

module.exports = {router};