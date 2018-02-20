'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');

const {Shelf} = require('./models');

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

module.exports = {router};