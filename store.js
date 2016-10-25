"use strict";
var debug = require('debug')('sniffer:store');

var path = require('path');


var resolve = [];
resolve[0] = 'adm';

var app = require('express')();
var LVL = require('./login').LVL;
var checkAccess = require('./login').checkAccess;
let Book = require('./mongo').Book;

var cookieParser = require('cookie-parser');

app.use(cookieParser());


app.all('*', function(req, res, next) {

    debug(req.originalUrl);

    if (checkAccess(req.lvl, 'user'))
    {
        debug(req.userName);

        next();
    }
    else
    {
        res.status(401).end();
    }
});

// :id - book id
app.delete('/book/delete/_:id', function (req, res) {
    let id = req.params.id;

	Book.deleteBook(id, req.userName, function (err) {
        if (err)
        {
            res.status(500).json(err).end();
        }
        else
        {
            res.status(200).end();
        }
    });
});

// :id - book id
app.get('/book/get/_(:id)', function(req, res) {
    let id = req.params.id;

    let cb = function(err, book) {
        if (err)
        {
            res.status(401).end();
        }
        else
        {
            if (book && book.link)
            {
                debug(path.join(__dirname, './files/', book.link));

                res.sendFile(path.join(__dirname, 'files', book.link), function (err) {
                    if (err)
                    {
                        if (err.code === "ECONNABORT" && res.statusCode == 304) {
                            // No problem, 304 means client cache hit, so no data sent.
                            debug('304 cache hit for ' + book.link);
                        }
                        else
                        {
                            debug("SendFile error:", err, " (status: " + err.statusCode + ")");
                            if (err.statusCode)
                            {
                                res.end();
                            }
                        }
                    }
                    else
                    {
                        debug('Sent:', book.link);
                    }
                });
            }
            else
            {
                res.status(500).json({
                    err: 1,
                    errmsg: 'Database error'
                }).end();
            }
        }
    };

    if (req.lvl <= LVL['MOD'])
    {
	    Book.getBook(id, req.userName, cb, true);
    }
    else
    {
        Book.getBook(id, req.userName, cb);
    }
});


module.exports.app = app;