"use strict";
let app = require("express")();
let cookieParser = require("cookie-parser");

let fs = require("fs");

let debug = require("debug")("sniffer:book");

app.use(cookieParser());

let checkAccess = require("./login").checkAccess;






app.use(require("body-parser").json());

// Access for USER
app.all("*", (req, res, next) => {
	if (req.user.checkAccess("addBook"))
	{
		next();
	}
	else
	{
		res.status(401).json({
			err: 1,
			errmsg: "No access"
		}).end();
	}
});


module.exports.app = app;