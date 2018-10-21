"use strict";
let app = require("express")();
let cookieParser = require("cookie-parser");

let debug = require("debug")("sniffer:adminPanel");

app.use(cookieParser());
app.use(require("body-parser").json());

let getById = require("./db/mongo").getById;
let getCol = require("./db/mongo").getCol;
let deleteById = require("./db/mongo").deleteById;
let addDoc = require("./db/mongo").addDoc;

let schemas = require("./db/mongo").schemas;

const allowedFunc = require("./adminFunc");

app.all("*", (req, res, next) => {
    if (req.user.checkAccess("admin"))
    {
        next();
    }
    else
    {

        res.set("Location", "/");

        res.status(302).end();
    }
});

function filter(obj, checker)
{
	let tmp = Object.create(obj.__proto__);

	for (let i in obj)
	{
		if (obj.hasOwnProperty(i))
		{
			if (checker(i, obj[i], obj))
			{
				tmp[i] = obj[i];
			}
		}
	}

	return tmp;
}

function renameObjectProp(obj)
{
	let tmp = Object.create(null);

	for (let i in obj)
	{
		tmp[i.substr(2)] = obj[i];
	}

	return tmp;
}

app.get("/index.jade", function (req, res) {

    res.set("Content-Type", "text/html");

    res.render("./admin/index.jade", {
        title: "Admin panel",
        schemas: schemas,
	    hints: Object.keys(allowedFunc).filter((name)=>name[0] != "_"),
	    func: JSON.stringify(renameObjectProp(filter(allowedFunc, (name) => name[0] == "_"), "__")),
	    salt: Date.now()
    });
});

app.get("/get/schema/_:col", (req, res) => {
    let col = req.params.col;

    if (["user", "book", "invite"].indexOf(col) > -1)
    {
        res.json(schemas[["user", "book", "invite"].indexOf(col)].schema).end();
    }
    else
    {
        res.status(403).end();
    }
});

app.post("/add/_:col", (req, res) => {
    let col = req.params.col;

	let value = req.body;

    switch (col)
    {
	    case "user":
		                addDoc("user", value, (err) => {
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
	    case "book":
		                addDoc("book", value, (err) => {
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
        case "invite":
                        addDoc("invite", value, (err) => {
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

app.get("/get/_:col/_:id", (req, res) => {
    let col = req.params.col;
    let id = req.params.id;

    if (["user", "book", "invite"].indexOf(col) > -1)
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

app.get("/get/_:col/all", (req, res) => {
    let col = req.params.col;

    if (["user", "book", "invite"].indexOf(col) > -1)
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

app.post("/cmd", (req, res) => {
	let cmd = req.body.cmd || "";

	let args = cmd.split(" ");
	let func = args.shift();

	debug("Command: %s(%s)", func, args);

	args.push(cb);

	if (typeof allowedFunc[func] == "function")
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
			if (typeof data == "undefined")
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

app.post("/delete/_:col/_:id", (req, res) => {
    let col = req.params.col;
    let id = req.params.id;

    if (["user", "book", "invite"].indexOf(col) > -1)
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