"use strict";
let express = require('express');
let path = require('path');
let store = require('./store');

let session = require('express-session');

const userConstructor = require('./user');

let User = require('./mongo').User;

let routes = require('./routes/index');
// let users = require('./routes/users');
let debug = require('debug')('sniffer:app');

let app = express();

let cookieParser = require('cookie-parser');

app.use(cookieParser());

app.use(require('body-parser').json());

app.use(session({
	secret: process.env.SESSION_SECRET || 'SECRET_',
	resave: true,
	saveUninitialized: true
}));


const genUID = function (){
	let id = 0;

	return function () {
		return ++id;
	}
}();

// static
app.use(express.static(__dirname + '/public'));

app.get('/favicon.ico', function (req, res) {
	res.end();
});

if (app.get('env') === 'development')
{
	app.use(function(req, res, next) {
		let secret = req.query.secret || '0';

		if (secret === userConstructor.SecretUser.SECRET_KEY_FOR_SIGN_IN
			&& typeof userConstructor.SecretUser.SECRET_KEY_FOR_SIGN_IN === 'string')
		{
			userStorage[req.session.id] = new userConstructor.SecretUser();
			req.user = userStorage[req.session.id];
		}

		next();
	});
}

let userStorage = require('./user').userStorage;

app.use(function(req, res, next){
    req.cookies.user = req.cookies.user || '0';
    let nm = (req.cookies.user.split('_'))[0] || 0;

	req.userIp = req.connection.remoteAddress;

	if (req.session.id && userStorage[req.session.id])
	{
		if (userStorage[req.session.id].isLogin() && (req.cookies.user == userStorage[req.session.id].secret
			|| userStorage[req.session.id].isSecret()))
		{
			req.user = userStorage[req.session.id];
			req.user.update();

			next();

			return;
		}
		else
		{
			if (userStorage[req.session.id].isLogin() == false && req.cookies.user == '0')
			{

				req.user = userStorage[req.session.id];
				req.user.update();

				next();

				return;
			}
		}
	}

	User.checkUserNameAndSecret(nm, req.cookies.user, function (err, data) {

		debug('session id:' + req.session.id);

        if (err)
        {
	        userStorage[req.session.id] = new userConstructor.Guest();
        }

        if (data)
        {
	        userStorage[req.session.id] = new userConstructor.User(data);
        }
        else
        {
            // res.clearCookie('user', {path: '/'});

            debug('URL: ' + req.originalUrl);

	        userStorage[req.session.id] = new userConstructor.Guest();
        }

        req.user = userStorage[req.session.id];

        next();
    });
});

// Optional since express defaults to CWD/views

app.set('views', __dirname + '/views');

// Set our default template engine to "jade"
// which prevents the need for extensions
// (although you can still mix and match)
app.set('view engine', 'jade');

app.get('/', function (req, res) {
    if (req.user.isLogin() == false)
    {
        res.set('Location', '/login.jade');

        res.status(302).end();
    }
    else
    {
        res.set('Content-Type', 'text/html');

        res.render('index.jade', {
            title: 'index.jade'
        });
    }
});

app.get('/login.jade', function (req, res) {

    if (req.user.isLogin() == false)
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
    }
});

app.get('/registration.jade', function (req, res, next) {
    if (req.user.checkAccess('registration'))
    {
        res.set('Content-Type', 'text/html');

        res.render('registration.jade', {
            title: 'Registration'
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

// Admin panel
app.use('/admin', require('./admin').app);

app.all('/echo/:msg', function(req, res) {
	if (app.get('env') === 'development') {
		let MB = 1000 * 1000;
		let echo = process.memoryUsage();
		echo.heapTotal /= MB;
		echo.heapUsed /= MB;
		echo.rss /= MB;
		echo.freemem = require('os').freemem() / MB;
		echo.totalmem = require('os').totalmem() / MB;
		echo.sum = echo.heapTotal + echo.heapUsed + echo.rss;

		res.status(200).json(echo).end();
	}
	else
	{
		res.status(200).end();
	}

	if (req.params.msg && req.params.msg.length > 1)
	{
		debug('ECHO: ', req.params.msg);
	}
});


module.exports.app = app;