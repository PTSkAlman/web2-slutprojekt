var express = require('express');
var router = express.Router();
const pool = require('../database');

router.get('/', async (req, res, next) => {
    if (!req.session.username) return res.redirect("/signin");

    if (req.session.username !== 'admin') {
        await pool.promise()
        .query('SELECT * FROM jolabn_tasks WHERE user_id = ? ORDER BY created_at DESC', [req.session.user_id])
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
    } else {
        await pool.promise()
        .query('SELECT jolabn_tasks.*, jolabn_login.username FROM jolabn_tasks JOIN jolabn_login ON jolabn_tasks.user_id = jolabn_login.id ORDER BY created_at DESC')
        .then(([rows, fields]) => {
            console.log(rows);
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
    }
    
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

router.get('/:id/delete', async (req, res, next) => {
    const id = req.params.id;

    if (isNaN(req.params.id)) {
        res.status(400).json({
            task: {
                error: 'Bad request'
            }
        });
    }
    await pool.promise()
        .query('DELETE FROM jolabn_tasks WHERE id = ?', [id])
        .then((response) => {
            if (response[0].affectedRows === 1) {
                req.session.flash = "Task deleted";
                res.redirect('/profile');
            } else {
                req.session.flash = "Task not found";
                res.status(400).redirect('/profile');
            }
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

module.exports = router;