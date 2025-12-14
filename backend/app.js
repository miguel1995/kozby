// src/app.js
const express = require('express');
require('dotenv').config();

const app = express();

app.use(express.json());

app.use('/productos', require('./routes/productos.routes'));

module.exports = app;
