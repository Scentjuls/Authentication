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


//Check Connection
db.once('open', function(){
    console.log("connected to MONGODB")
});

// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//Express Message Middleware
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
// Express Session Middleware
app.use(session({
secret:"my keyboard cat",
resave: true,
saveUninitialized: true
}));

//Passport Config
require('./config/passport')(passport);

//Passport Middleware 
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
    res.locals.user = req.user || null;
    next();
})


app.use('/', index);
app.use('/users', users);

// Catch 404n And Forward To Error Handler 
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error Handler
app.use(function(err, req, res, next) {
  // Set Locals, Only Providing Error In Development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render The Error Page 
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3001, function (){
    console.log('server started on port 3001');
})
module.exports = app;
