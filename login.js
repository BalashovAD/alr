"use strict";
var app = require('express')();
var cookieParser = require('cookie-parser');

var debug = require('debug')('sniffer:login');

app.use(cookieParser());

var __log = [];

const LVL = {
    MAX_LVL: 1000,
    GUEST: 5,
    USER: 4,
    MOD: 2,
    ADM: 0
};

const ACCESS_LVL = {
    registration: LVL['GUEST'],
    addBook: LVL['USER'],
    user: LVL['USER'],
    moder: LVL['MOD'],
    admin: LVL['ADM']
};

let User = require('./mongo').User;

let Invite = require('./mongo').Invite;


function checkAccess (lvl, str)
{
    return (lvl <= ACCESS_LVL[str]);
}

app.use(require('body-parser').json());

function getLinkFromQuery(link)
{
	const allowed = ['share', 'admin'];
	if (typeof link == 'undefined')
	{
		return '';
	}
	else
	{
		if (link.indexOf('..') >= 0)
		{
			return '';
		}
		else
		{
			for (let i = 0; i < allowed.length; ++i)
			{
				if (link.indexOf(allowed[i]) == 0)
				{
					return link;
				}
			}
		}
	}

	return '';
}

// Login
// user/psw
// TODO: psw -> hash(psw)
app.get('/_:user/_(:psw)?', function(req, res){
    var name = req.params.user;
    var psw = req.params.psw;
	res.query = res.query || {};

    User.checkUserNameAndPsw(name, psw, function (err, data) {
        if (!err && data)
        {
            res.cookie('user', data.prop.secret);

            res.status(200).json({
	            link: getLinkFromQuery(res.query.link)
            }).end();
        }
        else
        {
            debug('Tried to login (user = ' + name + ', ip = ' + req.userIp + ' )');
            debug(err);

            res.status(402).json({
	            link: 'error.jade'
            }).end();
        }
    });
});

// exit
//
app.get('/exit/_:user/', function(req, res){
    var name = req.params.user;

    if (req.userName != '0')
    {
        debug('Exit (user = ' + name + ')');

        res.clearCookie('user', {
            path: '/'
        });

        res.status(200).json({
	        link: 'login.jade'
        }).end();
    }
    else
    {
        debug('Tried to exit (user = ' + name + ', ip = ' + req.userIp + ' )');

        res.status(402).end();
    }
});

// Registration
// now access only for all
app.post('/add/*', (req, res, next) => {
    if (checkAccess(req.lvl, 'registration'))
    {
        next();
    }
    else
    {
        res.status(402).json({
            err: -1,
            errmsg: 'No access'
        });

        res.end();
    }
});


// TODO: psw -> hash(psw)
// TODO: regExp(user)
app.post('/add/', (req, res, next) => {
    var user = req.body.name;
    var psw = req.body.psw;
	let invite = req.body.invite;

    debug('User ' + req.userName + ' create user;');
    debug('user = %s, psw = %s', user, psw);

    if (checkAccess(req.lvl, 'registration'))
    {
        Invite.getInvite(invite, function (err, inv) {
	        if (err)
	        {
		        res.status(403).json({
			        errmsg: 'Wrong invite'
		        }).end();
	        }
	        else
	        {
		        User.addUser(user, psw, (err, user) => {

			        if (err)
			        {
				        debug(err);

				        res.status(403).json({
					        err: err.code,
					        errmsg: err.errmsg
				        }).end();

				        return false;
			        }
			        else
			        {
				        res.json({
					        id: user._id,
					        name: user.name,
					        lvl: user.prop.lvl,
					        link: getLinkFromQuery(req.query.link)
				        }).end();

				        req.regUserId = user._id;

				        inv.dec(user);

				        next();
			        }

			        return true;
		        });
	        }
        });
    }
    else
    {
        res.status(403).json({
            errmsg: 'U must be admin'
        }).end();

        return false;
    }
});

// Get db document
// :user - only u
app.get('/info', function (req, res) {
    if (req.userName != 0)
    {
        User.getUser(req.userName, function(err, t) {
            if (err)
            {
                res.status(402).end();
            }
            else
            {
                res.json(t).end();
            }
        });
    }
    else
    {
        res.status(401).end();
    }
});

module.exports.app = app;
module.exports.__log = __log;
module.exports.LVL = LVL;
module.exports.checkAccess = checkAccess;
module.exports.ACCESS_LVL = ACCESS_LVL;
