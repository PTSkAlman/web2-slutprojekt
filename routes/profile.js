var express = require('express');
var router = express.Router();
const pool = require('../database');
var session = require('express-session')

router.get('/', function(req, res, next) {
    //if(!req.session.user) return res.redirect("/signin");
    res.render('profile.njk', { title: 'secret', user: req.session.user });
    console.log(req.session.user);
});

module.exports = router;