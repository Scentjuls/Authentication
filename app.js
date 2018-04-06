const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passportLocal = require('passport-local');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const messages = require('express-messages');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const config = require('./config/database');
const index = require('./routes/index');
const users = require('./routes/users');


var app = express();
mongoose.connect(config.database);
let db = mongoose.connection;


//check connection
db.once('open', function(){
    console.log("connected to MONGODB")
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//Express messages middlewre
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value){
      var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

      while(namespace.length){
          formParam += '[' + namespace.shift()+ ']';
      }
      return {
          param : formParam,
          msg: msg,
          value: value
      };
  }
}));
// Express session middleware
app.use(session({
secret:"my keyboard cat",
resave: true,
saveUninitialized: true
}));

//Passport confid
require('./config/passport')(passport);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
    res.locals.user = req.user || null;
    next();
})


app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
