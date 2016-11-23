"use strict";
let app = require('express')();
let cookieParser = require('cookie-parser');

let debug = require('debug')('sniffer:adminPanel');

app.use(cookieParser());
app.use(require('body-parser').json());

let getById = require('./mongo').getById;
let getCol = require('./mongo').getCol;
let deleteById = require('./mongo').deleteById;
let addDoc = require('./mongo').addDoc;

let schemas = require('./mongo').schemas;

const allowedFunc = require('./adminFunc');

app.all('*', (req, res, next) => {
    if (req.user.checkAccess('admin'))
    {
        next();
    }
    else
    {

        res.set('Location', '/');

        res.status(302).end();
    }
});


app.get('/index.jade', function (req, res) {

    res.set('Content-Type', 'text/html');

    res.render('./admin/index.jade', {
        title: 'Admin panel',
        schemas: schemas,
	    hints: Object.keys(allowedFunc),
	    salt: Date.now()
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

	let value = req.body;

    switch (col)
    {
	    case 'user':
		                addDoc('user', value, (err) => {
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
	    case 'book':
		                addDoc('book', value, (err) => {
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
        case 'invite':
                        addDoc('invite', value, (err) => {
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

app.post('/cmd', (req, res) => {
	let cmd = req.body.cmd || '';

	let args = cmd.split(' ');
	let func = args.shift();

	debug('Command: %s(%s)', func, args);

	args.push(cb);

	if (typeof allowedFunc[func] == 'function')
	{
		allowedFunc[func].apply(null, args);
	}
	else
	{
		res.status(404).end();
	}

	function cb(err, data)
	{
		if (err)
		{
			res.status(500).end();
		}
		else
		{
			if (typeof data == 'undefined')
			{
				res.status(200).end();
			}
			else
			{
				res.status(200).json(data).end();
			}
		}
	}
});

app.post('/delete/_:col/_:id', (req, res) => {
    let col = req.params.col;
    let id = req.params.id;

    if (['user', 'book', 'invite'].indexOf(col) > -1)
    {
        deleteById(col, id, function(err) {
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