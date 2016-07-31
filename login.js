"use strict";
var app = require('express')();
var cookieParser = require('cookie-parser');

var debug = require('debug')('sniffer:login');

app.use(cookieParser());

var checkUser = require('./mongo').checkUser;
var getUser = require('./mongo').getUser;

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

function checkAccess (lvl, str)
{
    return (lvl <= ACCESS_LVL[str]);
}

var addUser = require('./mongo').addUser;

app.use(require('body-parser').json());

// Login
// user/psw
// TODO: psw -> hash(psw)
app.get('/_:user/_(:psw)?', function(req, res, next){
    var name = req.params.user;
    var psw = req.params.psw;

    checkUser(name, function (err, u) {
        if (!err && u && u.name == name && u.prop.psw == psw)
        {
            debug('Login (user = ' + name + ')');

            res.cookie('user', u.prop.secret);

            res.status(200).end();
        }
        else
        {
            debug('Tried to login (user = ' + name + ', ip = ' + req.userIp + ' )');
            debug(err);

            res.status(402).end();
        }
    });
});

// exit
//
app.get('/exit/_:user/', function(req, res, next){
    var name = req.params.user;

    if (req.userName != '0' || checkAccess(req.lvl, 'moder'))
    {
        debug('Exit (user = ' + name + ')');

        res.clearCookie('user', {
            path: '/'
        });

        res.status(200).end();
    }
    else
    {
        debug('Tried to exit (user = ' + name + ', ip = ' + req.userIp + ' )');

        res.status(402).end();
    }
});

// Registration
// now access only for adm
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

var checkInvite = require('./mongo').checkInvite;
var decInvite = require('./mongo').decInvite;

/**
 * Check invite value
 */
app.post('/add/', (req, res, next) => {
    let invite = req.body.invite;

    debug('invitation.value = ' + invite);

    checkInvite(invite, (err, t) => {
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
            debug('inv = ' + t);

            if (t.counter > 0)
            {
                next();
            }
        }
    });
});

// TODO: psw -> hash(psw)
// TODO: regExp(user)
app.post('/add/', (req, res, next) => {
    var user = req.body.name;
    var psw = req.body.psw;

    debug('User ' + req.userName + ' create user;');
    debug('user = %s, psw = %s', user, psw);

    if (checkAccess(req.lvl, 'registration'))
    {
        addUser(user, psw, (err, t) => {

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
                    id: t._id,
                    name: t.name,
                    lvl: t.prop.lvl
                }).end();

                req.regUserId = t._id;
                next();
            }

            return true;
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

/**
 * Decrement invite.counter
 * Add user in invites
 */
app.post('/add/', (req, res, next) => {
    let invite = req.body.invite;

    decInvite(invite, req.regUserId, (err, t) => {
        if (err)
        {
            debug(err);

            return false;
        }
        else
        {

        }
    })
});

// Get db document
// :user - only u
app.get('/info', function (req, res, next) {
    if (req.userName != 0)
    {
        getUser(req.userName, function(err, t) {
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
