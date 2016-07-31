"use strict";
var app = require('express')();
var cookieParser = require('cookie-parser');

var debug = require('debug')('admin:book');

app.use(cookieParser());

var checkAccess = require('./login').checkAccess;

app.all('*', (req, res, next) => {
    if (checkAccess(req.lvl, 'admin'))
    {
        next();
    }
    else
    {

        res.set('Location', '/');

        res.status(401).end();

        next();
    }
});


app.get('/login.jade', function (req, res, next) {

    res.set('Content-Type', 'text/html');

    res.render('admin.jade', {
        title: 'Admin'
    });
});