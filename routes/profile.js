var express = require('express');
var router = express.Router();
const pool = require('../database');

router.get('/', async (req, res, next) => {
    if(!req.session.username) return res.redirect("/signin");
    await pool.promise()
        .query('SELECT * FROM jolabn_tasks WHERE user_id = ?', [req.session.user_id])
        .then(([rows, fields]) => {
            res.render('profile.njk', {
                tasks: rows,
                title: 'Profile',
                layout: 'layout.njk',
                username: req.session.username
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                tasks: {
                    error: 'Error getting tasks'
                }
            })
        });
});

router.post('/', async (req, res, next) => {
    const task = req.body.task;

    if (task.length < 3) {
        res.redirect('/profile');
    } else {
        await pool.promise()
        .query('INSERT INTO jolabn_tasks (task, user_id) VALUES (?,?)', [task, req.session.user_id])
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

router.post('/:id/complete', async (req, res, next) => {
    const id = req.params.id;

    await pool.promise()
        .query('UPDATE jolabn_tasks SET completed = !completed WHERE id = ?', [id])
        .then((response) => {
            res.json({
                task: {
                    data: response
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                tasks: {
                    error: 'Invalid task'
                }
            })
        });

});

module.exports = router;