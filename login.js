"use strict";
let app = require("express")();
let cookieParser = require("cookie-parser");

let debug = require("debug")("sniffer:login");

app.use(cookieParser());

let __log = [];

const LVL = {
    MAX_LVL: 1000,
    GUEST: 5,
    USER: 4,
    MOD: 2,
    ADMIN: 0
};

const ACCESS_LVL = {
    registration: LVL["GUEST"],
    memory: LVL["ADMIN"],
    addBook: LVL["USER"],
    book: LVL["MOD"],
    user: LVL["USER"],
    moder: LVL["MOD"],
    admin: LVL["ADMIN"]
};

let User = require("./db/mongo").User;

let Invite = require("./db/mongo").Invite;


function checkAccess (lvl, str)
{
    return (lvl <= ACCESS_LVL[str]);
}

app.use(require("body-parser").json());

function getLinkFromQuery(link)
{
	const allowed = ["share", "admin"];
	if (typeof link == "undefined")
	{
		return "";
	}
	else
	{
		if (link.indexOf("..") >= 0)
		{
			return "";
		}
		else
		{
			for (let i = 0; i < allowed.length; ++i)
			{
				if (link.indexOf(allowed[i]) === 0)
				{
					return link;
				}
			}
		}
	}

	return "";
}

// Login
// user/psw
// TODO: psw -> hash(psw)
app.get("/_:user/_(:psw)?", function(req, res){
    let name = req.params.user;
    let psw = req.params.psw;
	res.query = res.query || {};

	if (User.checkUserNameAndPsw(name, psw))
    {
        User.getUserByName(name).then(function (data) {
            res.cookie("user", data.prop.secret);

            res.status(200).json({
                link: getLinkFromQuery(res.query.link)
            }).end();
        }, (err) => {
            debug(`login cannot getUserByName: ${err}`);

            res.status(500).json({
                link: "error.pug"
            }).end();
        });
    }
    else
    {
        debug(`Tried to login (user: ${name}, psw: ${psw}, ip: ${req.userIp})`);

        res.status(403).json({
            link: "error.pug"
        }).end();
    }
});

// exit
//
app.get("/exit/_:user/", function(req, res){
    let name = req.params.user;

    if (req.user.isLogin())
    {
        debug("Exit (user = " + req.user.name + ")");

        res.clearCookie("user", {
            path: "/"
        });

	    res.clearCookie("connect.sid", {
		    path: "/"
	    });

	    req.user.exit();

	    req.user.setDeleteMode();

        res.status(200).json({
	        link: "login.pug"
        }).end();
    }
    else
    {
        debug("Tried to exit (user = " + name + ", ip = " + req.userIp + " )");

        res.status(402).end();
    }
});

// Registration
// now access only for all
app.post("/add/*", (req, res, next) => {
    if (req.user.checkAccess("registration"))
    {
        next();
    }
    else
    {
        res.status(402).json({
            err: -1,
            errmsg: "No access"
        });

        res.end();
    }
});


// TODO: psw -> hash(psw)
// TODO: regExp(user)
app.post("/add/", (req, res, next) => {
    let user = req.body.name;
    let psw = req.body.psw;
	let invite = req.body.invite;

    debug("User " + req.user.name + " create user;");
    debug("user = %s, psw = %s", user, psw);

    if (req.user.checkAccess("registration"))
    {
        Invite.getInvite(invite, function (err, inv) {
	        if (err || inv === null)
	        {
		        res.status(403).json({
			        errmsg: "Wrong invite"
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
            errmsg: "U must be admin"
        }).end();

        return false;
    }
});

// Get db document
// :user - only u
app.get("/info", function (req, res) {
    if (req.user.isLogin())
    {
        User.getUserByName(req.user.name).then((user) => {
            res.json(user).end();
        }, (err) => {
            debug(`Cannot getUserByName: ${err}`);
            res.status(403).end();
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
