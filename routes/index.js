const express = require('express');
const flash = require('connect-flash');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home');
});

module.exports = router;
