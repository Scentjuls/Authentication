const express = require('express');
const flash = require('connect-flash');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();


//Bringing in the user model 
let User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//Register Form 
router.get('/register', function(req, res){
  res.render('register');
});

//Register Process
router.post('/register', (req, res) =>{
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

 let errors = req.validationErrors();

 if (errors){
   res.render('register',{
    errors:errors
   });
 } else{
   let newUser = new User({
    name:name,
    email:email,
    username:username,
    password:password
   });

   bcrypt.genSalt(10, function(err, salt){
    bcrypt.hash(newUser.password, salt, function(err, hash){
      if (err){
        console.log(err)
      }
      newUser.password = hash;
      newUser.save(function(err){
        if (err){
          console.log(err);
          return;
        } else {
          req.flash('success', 'you have registered, now you can log in');
          res.redirect('/users/login');
        }
      });
    });
   });
 }
});
//Login Form 
router.get('/login', (req, res) => {
  res.render('login');
});

//Login Process
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/users/login',
    failureFlash: true
  })(req, res, next);
});

//Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'you are logged out');
  res.render('logout')
});
module.exports = router;
