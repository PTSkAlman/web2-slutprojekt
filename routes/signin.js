var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const pool = require('../database');
var session = require('express-session')

router.get('/', function(req, res, next) {
  res.render('signin.njk', { title: 'Sign in' });
});

router.post('/', async (req, res, next) => {

  const username = req.body.username;
  const password = req.body.password;

  await pool.promise()
      .query('SELECT * FROM jolabn_login WHERE username=?', [username])
      .then(([rows, fields]) => {
        const user = rows[0];

        if(user) {
            bcrypt.compare(password, user.password, (err, result) => {  

                if(result) {
                    req.session.username = username;
                    req.session.user_id = user.id;
                    return res.redirect("/profile");
                } else {
                    console.log("Cannot log in");
                }

            });
        } else throw "error";

      })
      .catch(err => {
          console.log(err);
      });
});

module.exports = router;
