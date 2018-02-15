'use strict';
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');

const app = express();

app.use(morgan('common'));

app.use(express.static('public'));

app.listen(process.env.PORT || 8080);


module.exports = {app};