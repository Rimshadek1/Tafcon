const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const path = require('path');
const fileUpload = require('express-fileupload');
const indexRouter = require('./routes/index');
const db = require('./config/connection');
const createError = require('http-errors');


const app = express();
app.use(cors({
    origin: ['http://localhost:4001'],
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true
}));
app.use('/public', express.static(__dirname + '/public'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use('/', indexRouter);
app.use(bodyParser.json());
require('dotenv').config();

// Making Build Folder as Public 
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

db.connect((err) => {
    if (err)
        console.log('error ' + err);
    else
        console.log("Database connected");
});
const Port = process.env.PORT
app.listen(Port, () => {
    console.log(`Server is running at ${Port}`);
});
