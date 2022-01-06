const express = require('express');
const route = express.Router();
const services = require('../services/serives')
const bodyParser = require('body-parser');
const {check, validationResult}= require('express-validator');
const urlencodeParser = bodyParser.urlencoded({extended:false});
/**
 * @description Root Route
 * @method GET 
 */
route.get('/', services.homeRoutes);
route.get('/termin/:id', services.find);
route.post('/', urlencodeParser, 
[check('Uhrzeit','wählen Sie bitte eine Uhrzeit!').exists()],services.neuUser);

route.get('/', services.homeRoutes);

module.exports = route