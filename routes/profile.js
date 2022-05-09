var express = require('express');
var router = express.Router();
const pool = require('../database');

router.get('/', function(req, res, next) {
    if(!req.session.username) return res.redirect("/signin");
    res.render('profile.njk', { title: 'Profile', username: req.session.username });
});

router.post('/', async (req, res, next) => {
    const task = req.body.task;

    if (task.length < 3) {
        res.redirect('/tasks');
    } else {
        await pool.promise()
        .query('INSERT INTO tasks (task) VALUES (?)', [task])
        .then((response) => {
            if (response[0].affectedRows == 1) {
                res.redirect('/profile');
            } else {
                res.status(400).json({
                    task: {
                        error: 'Invalid task'
                    }
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                tasks: {
                    error: 'Invalid task'
                }
            })
        });
    }
});

module.exports = router;