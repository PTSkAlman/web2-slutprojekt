var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
const pool = require('../database');



router.get('/', function(req, res, next) {
  res.render('signup.njk', { title: 'Sign up' });
});

router.post('/', async (req, res, next) => {
  console.log(req);
  const username = req.body.username;
  const password = req.body.password;
  if(password < 3){
      console.log('need more than 3 characters');
  }
  bcrypt.hash(password, 10, async function (err, hash) {

    await pool.promise()
    .query('INSERT INTO jolabn_login (username, password) VALUES (?,?)', [username,hash])
    .then(([rows, fields]) => {
        res.redirect("/signin");
    }).catch(err => {
        console.log(err);
    });

  });
});

module.exports = router;
