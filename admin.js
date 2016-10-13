"use strict";
var app = require('express')();
var cookieParser = require('cookie-parser');

var debug = require('debug')('admin:book');

app.use(cookieParser());
app.use(require('body-parser').json());

var checkAccess = require('./login').checkAccess;
var getById = require('./mongo').getById;
var getCol = require('./mongo').getCol;
var deleteById = require('./mongo').deleteById;
var addDoc = require('./mongo').addDoc;

var schemas = require('./mongo').schemas;

app.all('*', (req, res, next) => {
    if (checkAccess(req.lvl, 'admin'))
    {
        next();
    }
    else
    {

        res.set('Location', '/');

        res.status(302).end();
    }
});


app.get('/index.jade', function (req, res, next) {

    res.set('Content-Type', 'text/html');

    res.render('./admin/index.jade', {
        title: 'Admin panel',
        schemas: schemas
    });
});

app.get('/get/schema/_:col', (req, res) => {
    let col = req.params.col;

    if (['user', 'book', 'invite'].indexOf(col) > -1)
    {
        res.json(schemas[['user', 'book', 'invite'].indexOf(col)].schema).end();
    }
    else
    {
        res.status(403).end();
    }
});

app.post('/add/_:col', (req, res) => {
    let col = req.params.col;

    switch (col)
    {
        case 'invite':
                        let value = req.body;

                        addDoc('invite', value, (err, t) => {
                            if (err)
                            {
                                res.status(403).end();
                            }
                            else
                            {
                                res.end();
                            }
                        });

                        break;
        default:
                 res.status(403).end();
    }
});

app.get('/get/_:col/_:id', (req, res) => {
    let col = req.params.col;
    let id = req.params.id;

    if (['user', 'book', 'invite'].indexOf(col) > -1)
    {
        getById(col, id, function(err, t) {
            if (err)
            {
                res.status(403).end();
            }
            else
            {
                res.json(t).end();
            }

        });
    }
    else
    {
        res.status(403).end();
    }
});

app.get('/get/_:col/all', (req, res) => {
    let col = req.params.col;

    if (['user', 'book', 'invite'].indexOf(col) > -1)
    {
        getCol(col, function(err, t) {
            if (err)
            {
                res.status(403).end();
            }
            else
            {
                res.json(t).end();
            }

        });
    }
    else
    {
        res.status(403).end();
    }
});

app.delete('/delete/_:col/_:id', (req, res) => {
    let col = req.params.col;
    let id = req.params.id;

    if (['user', 'book', 'invite'].indexOf(col) > -1)
    {
        deleteById(col, id, function(err, t) {
            if (err)
            {
                res.status(403).end();
            }
            else
            {
                res.status(200).end();
            }

        });
    }
    else
    {
        res.status(403).end();
    }
});

module.exports.app = app;