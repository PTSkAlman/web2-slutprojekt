require('dotenv').config()
var express = require('express');
const session = require('express-session')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');

var indexRouter = require('./routes/index');
var signupRouter = require('./routes/signup');
var signinRouter = require('./routes/signin');
var profileRouter = require('./routes/profile');

var app = express();
const nunjucks = require('nunjucks');

var app = express()
app.use(session({
  secret: 'd4bb1ng',
  resave: false,
  saveUninitialized: true,
  cookie: { sameSite: true }
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/signup', signupRouter);
app.use('/signin', signinRouter);
app.use('/profile', profileRouter);



nunjucks.configure('views', {
  autoescape: true,
  express: app
});

module.exports = app;
