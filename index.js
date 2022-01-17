const express = require('express');
const cors = require('cors');
const connectDB = require('./database/connection');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const path = require('path');
const rateLimit = require('express-rate-limit')

const createAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    delayAfter: 5,
    max: 10, // Limit each IP to 10 create account requests per `window` (here, per hour)
    message:
        'von diesem Geräte dürfen keine weitere Termine erstellt werden, da Sie Ihren Limit erreicht haben. Versuchen Sie es nach einer Stunde wieder oder verwenden Sie ein anderes Gerät!',
    standardHeaders: false, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
const PORT = process.env.PORT || 8080;
connectDB();
const app = express();
app.set('view engine', 'ejs');
app.use(createAccountLimiter);
const urlencodeParser = bodyParser.urlencoded({ extended: false });
app.use(cors());
app.use(express.json());
app.use('/css', express.static(path.resolve(__dirname, "assets/css")));
app.use('/img', express.static(path.resolve(__dirname, "assets/img")));

app.use('/css-1', express.static(path.resolve(__dirname, "views")));
app.use('/', require('./routes/router'));

app.listen(PORT, () => console.log(`node Started on ${PORT}`));

