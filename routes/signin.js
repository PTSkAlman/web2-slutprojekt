var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const pool = require('../database');

router.get('/', function(req, res, next) {
  res.render('signin.njk', { title: 'Sign in' });
});

router.post('/', async (req, res, next) => {

  const username = req.body.username;
  const password = req.body.password;

  await pool.promise()
      .query('SELECT * FROM jolabn_login WHERE username = ?', [username])
      .then(([rows, fields]) => {
          
        console.log(rows);
        const user = rows[0];

        if(user) {
            bcrypt.compare(password, user.password, (err, result) => {  

                if(result) {
                    //req.session.user = username;
                    //console.log(req.session);
                    console.log("You are now logged in");
                    return res.redirect("/");
                } else {
                    //res.status(500).redirect("/login?response=0");
                    console.log("Cannot log in");
                }

            });
        } else throw "error";

      })
      .catch(err => {
          //res.status(500).redirect("/login?response=0");
          console.log(err);
      });
});

module.exports = router;
