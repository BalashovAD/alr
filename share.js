"use strict";
var app = require('express')();
var cookieParser = require('cookie-parser');
var path = require('path');
var fs = require('fs');

var debug = require('debug')('sniffer:book');

app.use(cookieParser());

var checkAccess = require('./login').checkAccess;

let User = require('./mongo').User;
let Book = require('./mongo').Book;
let Invite = require('./mongo').Invite;


app.use(require('body-parser').json());

// Access for USER
app.all('*', (req, res, next) => {
	if (checkAccess(req.lvl, 'addBook'))
	{
		next();
	}
	else
	{
		res.status(401).json({
			err: 1,
			errmsg: 'No access'
		}).end();
	}
});


module.exports.app = app;