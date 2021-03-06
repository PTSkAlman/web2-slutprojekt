var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.njk', { title: 'Home', username: req.session.username });
});

router.post('/logout', function (req, res, next) {
  req.session.username = null;
  res.redirect("/signin");
});
module.exports = router;
