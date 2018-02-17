'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');

const config = require('../config');
const router = express.Router();

router.get('/', (req, res) => {
    res.sendStatus(200);
  });

module.exports = {router};