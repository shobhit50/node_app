const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;
const logger = require('./logger');
require('./models/config');

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('index');
});

app.use('/', require('./routes/url'));
app.use('/user', require('./routes/user'));



app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).render('error', {
        message: err.message,
        error: err
    });
});

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});