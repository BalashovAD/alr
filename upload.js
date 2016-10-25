var debug = require('debug')('sniffer:upload');

var resolve = [];
resolve[0] = 'adm';

var app = require('express')();
var checkAccess = require('./login').checkAccess;

var cookieParser = require('cookie-parser');

app.use(cookieParser());

app.get('/', function(req, res, next){

    if (checkAccess(req.lvl, 'addBook'))
    {
        next();
    }
    else
    {
        res.status(401).end();
    }
});

app.get('/index', function(req, res){
    res.set('Content-Type', 'text/html');

    res.render('upload.jade', {
        name: req.cookies.userName,
        title: 'Upload'
    });
});

app.post('/upload/', function(req, res){
    res.set('Content-Type', 'text/html');

    res.render('upload.jade', {
        name: req.cookies.userName,
        title: req.param.filename
    });
});


module.exports.app = app;