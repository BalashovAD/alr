"use strict";
var express = require('express');
var path = require('path');
var store = require('./store');



var checkUser = require('./mongo').checkUser;

var routes = require('./routes/index');
var users = require('./routes/users');
var debug = require('debug')('sniffer:app');

var app = express();

var cookieParser = require('cookie-parser');

var LVL = require('./login').LVL;

app.use(cookieParser());

app.use(require('body-parser').json());

app.use(function(req, res, next){
    req.cookies.user = req.cookies.user || '0';
    let nm = (req.cookies.user.split('_'))[0] || 0;
    //let secret = (req.cookies.user.split('_'))[1] || 0;


    req.userIp = req.connection.remoteAddress;

    checkUser(nm, function (err, u) {

        if (err)
        {
            req.userName = 0;
            req.lvl = LVL['GUEST'];

            return;
        }

        if (u && u.prop.secret == req.cookies.user)
        {
            req.userName = u.name;
            req.lvl = u.prop.lvl;
        }
        else
        {
            res.clearCookie('user', {path: '/'});

            req.userName = 0;
            req.lvl = LVL['MAX_LVL'];

            //debug('user {name: %s, lvl: %d} was load;', req.nameofuser, req.lvl)
        }


        next();
    });
});

// static
app.use(express.static(__dirname + '/public'));

// Optional since express defaults to CWD/views

app.set('views', __dirname + '/views');

// Set our default template engine to "jade"
// which prevents the need for extensions
// (although you can still mix and match)
app.set('view engine', 'jade');

app.get('/', function (req, res, next) {

    if (req.userName == 0)
    {
        res.set('Location', '/login.jade');

        res.status(302).end();

        next();
    }
    else
    {
        res.set('Content-Type', 'text/html');

        res.render('index.jade', {
            title: 'index.jade'
        });
    }
});

app.get('/login.jade', function (req, res, next) {

    if (req.userName == 0)
    {
        res.set('Content-Type', 'text/html');

        res.render('login.jade', {
            title: 'Login'
        });
    }
    else
    {
        res.set('Location', '/');

        res.status(302).end();

        next();
    }
});

// LOGIN
app.use('/login', require('./login').app);

// FILES
app.use('/store', require('./store').app);
//app.use('/files', express.static(__dirname + '/files'));

// UPLOAD
app.use('/upload', require('./upload').app);

// BOOK
app.use('/book', require('./book').app);

app.all('/echo*', function(req, res, next) {
    res.status(200).end();
});


module.exports = app;
