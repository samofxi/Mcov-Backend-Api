const express = require('express');
const route = express.Router();
const services = require('../services/serives')
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const urlencodeParser = bodyParser.urlencoded({ extended: false });
/**
 * @description Root Route
 * @method GET 
 */
route.post('/', urlencodeParser, [check('Uhrzeit', 'wählen Sie bitte eine Uhrzeit!').exists()], services.neuUser);

module.exports = route