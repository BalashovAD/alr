"use strict";
let express = require("express");
let path = require("path");
let store = require("./store");

let session = require("express-session");

const userConstructor = require("./user");

let User = require("./db/User").User;

let routes = require("./routes/index");
// let users = require("./routes/users");
let debug = require("debug")("sniffer:app");

let app = express();

let cookieParser = require("cookie-parser");

app.use(cookieParser());

app.use(require("body-parser").json());

app.use(session({
	secret: process.env.SESSION_SECRET || "SECRET_",
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
app.use(express.static(__dirname + "/public"));

app.get("/favicon.ico", function (req, res) {
	res.end();
});

if (app.get("env") === "development")
{
	app.use(function(req, res, next) {
		let secret = req.query.secret || "0";

		if (secret === userConstructor.SecretUser.SECRET_KEY_FOR_SIGN_IN)
		{
			userStorage[req.session.id] = new userConstructor.SecretUser();
			req.user = userStorage[req.session.id];
		}

		next();
	});
}

let userStorage = require("./user").userStorage;

app.use(function(req, res, next) {
    req.userIp = req.connection.remoteAddress;

	if (req.session.id && userStorage[req.session.id])
	{
		if (userStorage[req.session.id].isLogin())
		{
            if (req.cookies.user === userStorage[req.session.id].secret
				|| userStorage[req.session.id].isSecret())
			{
                req.user = userStorage[req.session.id];
                req.user.update();

                next();
                return;
			}
			else
			{
				debug(`SessionId has another user or 
				wrong secret(user: ${userStorage[req.session.id].toString()})`);
			}
		}
		else
		{
			req.user = userStorage[req.session.id];
			req.user.update();

			next();
			return;
		}
	}

	if (typeof req.cookies.user !== "string")
    {
        userStorage[req.session.id] = new userConstructor.Guest();
        req.user = userStorage[req.session.id];

        debug(`User doesn't have cookie ip: ${req.userIp}`);

        next();
        return;
    }

    let name = (req.cookies.user.split("_"))[0] || 0;

    if (User.checkUserNameAndSecret(name, req.cookies.user))
	{
        User.getUserByName(name).then((data) => {
            debug(`session id: ${req.session.id}`);

            if (data)
            {
                userStorage[req.session.id] = new userConstructor.RealUser(data);
            }
            else
			{
                debug(`User ${name} doesn't exist`);

                userStorage[req.session.id] = new userConstructor.Guest();
            }

            req.user = userStorage[req.session.id];

            next();
        }, (err) => {
            debug(`Cannot getUserByName name: ${name}: ${err}, url: ${req.originalUrl}`);
            userStorage[req.session.id] = new userConstructor.Guest();

            next();
        });
    }
    else
	{
        userStorage[req.session.id] = new userConstructor.Guest();
        req.user = userStorage[req.session.id];

        next();
	}
});

// Optional since express defaults to CWD/views

app.set("views", __dirname + "/views");

// Set our default template engine to "pug"
// which prevents the need for extensions
// (although you can still mix and match)
app.set("view engine", "pug");

app.get("/", function (req, res) {
    if (req.user.isLogin() === false)
    {
        res.set("Location", "/login.pug");

        res.status(302).end();
    }
    else
    {
        res.set("Content-Type", "text/html");

        res.render("index.pug", {
            title: "index.pug"
        });
    }
});

app.get("/login.pug", function (req, res) {

    if (req.user.isLogin() === false)
    {
        res.set("Content-Type", "text/html");

        res.render("login.pug", {
            title: "Login"
        });
    }
    else
    {
        res.set("Location", "/");

        res.status(302).end();
    }
});

app.get("/registration.pug", function (req, res, next) {
    if (req.user.checkAccess("registration"))
    {
        res.set("Content-Type", "text/html");

        res.render("registration.pug", {
            title: "Registration"
        });
    }
    else
    {
        res.set("Location", "/");

        res.status(302).end();

        next();
    }
});


// LOGIN
app.use("/login", require("./login").app);

// FILES
app.use("/store", require("./store").app);
//app.use("/files", express.static(__dirname + "/files"));

// UPLOAD
app.use("/upload", require("./upload").app);

// BOOK
app.use("/book", require("./book").app);

// Admin panel
app.use("/admin", require("./admin").app);

app.all("/echo/:msg", function(req, res) {
	if (app.get("env") === "development" && req.user.checkAccess("memory"))
	{
		let MB = 1000 * 1000;
		let echo = process.memoryUsage();
		echo.heapTotal /= MB;
		echo.heapUsed /= MB;
		echo.rss /= MB;
		echo.freemem = require("os").freemem() / MB;
		echo.totalmem = require("os").totalmem() / MB;
		echo.sum = echo.heapTotal + echo.heapUsed + echo.rss;

		res.status(200).json(echo).end();
	}
	else
	{
		res.status(200).end();
	}

	if (req.params.msg && req.params.msg.length > 1)
	{
		debug("ECHO: ", req.params.msg);
	}
});


module.exports.app = app;