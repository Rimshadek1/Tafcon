const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var logger = require('morgan');
const path = require('path');
var fileUpload = require('express-fileupload');
const indexRouter = require('./routes/index');
var db = require('./config/connection');
const fs = require('fs');
const jwt = require('jsonwebtoken')
var createError = require('http-errors');

const app = express();
app.use(cors({
    origin: ['http://localhost:4000'],
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true
}));
app.use('/public', express.static(__dirname + '/public'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload())
app.use('/', indexRouter);
app.use(bodyParser.json());

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

db.connect((err) => {
    if (err)
        console.log('error ' + err);
    else
        console.log("Database connected");
})

app.listen(3001, () => {
    console.log('server is running');
});
