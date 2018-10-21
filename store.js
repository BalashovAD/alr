"use strict";
let debug = require("debug")("sniffer:store");

let path = require("path");


let resolve = [];
resolve[0] = "adm";

let app = require("express")();
let LVL = require("./login").LVL;
let checkAccess = require("./login").checkAccess;
let Book = require("./db/mongo").Book;

let cookieParser = require("cookie-parser");

app.use(cookieParser());


app.all("*", function(req, res, next) {
    debug(req.originalUrl);

    if (req.user.checkAccess("user"))
    {
        debug(`Enter store: ${req.user.toString()}`);

        next();
    }
    else
    {
        res.status(403).end();
    }
});

// :id - book id
app.post("/book/delete/_:id", function (req, res) {
    let id = req.params.id;

    if (req.user.ownBook(id))
    {
        Book.deleteBook(id, req.user.name).then(() => {
            res.status(200).end();
        }, (err) => {
            res.status(500).json(err).end();
        });
    }
    else
    {
        res.status(403).end();
    }
});

// :id - book id
app.get("/book/get/_(:id)", function(req, res) {
    let id = req.params.id;

    let cb = function(err, book) {
        if (err)
        {
            res.status(401).end();
        }
        else
        {
            if (book && book.link)
            {
                debug(path.join(__dirname, "./files/", book.link));

                res.sendFile(path.join(__dirname, "files", book.link), function (err) {
                    if (err)
                    {
                        if (err.code === "ECONNABORT" && res.statusCode === 304) {
                            // No problem, 304 means client cache hit, so no data sent.
                            debug("304 cache hit for " + book.link);
                        }
                        else
                        {
                            debug("SendFile error:", err, " (status: " + err.statusCode + ")");
                            if (err.statusCode)
                            {
                                res.end();
                            }
                        }
                    }
                    else
                    {
                        debug("Sent:", book.link);
                    }
                });
            }
            else
            {
                res.status(500).json({
                    err: 1,
                    errmsg: "Database error"
                }).end();
            }
        }
    };

    if (req.user.ownBook(id) || req.user.checkAccess("book"))
    {
	    Book.getBook(id).then((book) => {cb(undefined, book)}, (err) => {cb(err)});
    }
    else
    {
        res.status(403).end();
    }
});


module.exports.app = app;