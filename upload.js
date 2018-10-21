"use strict";
let debug = require("debug")("sniffer:upload");

let resolve = [];
resolve[0] = "adm";

let app = require("express")();

let cookieParser = require("cookie-parser");

app.use(cookieParser());

app.get("/", function(req, res, next){

    if (req.user.checkAccess("addBook"))
    {
        next();
    }
    else
    {
        res.status(401).end();
    }
});

app.get("/index", function(req, res){
    res.set("Content-Type", "text/html");

    res.render("upload.pug", {
        name: req.cookies.userName,
        title: "Upload"
    });
});

app.post("/upload/", function(req, res){
    res.set("Content-Type", "text/html");

    res.render("upload.pug", {
        name: req.cookies.userName,
        title: req.param.filename
    });
});


module.exports.app = app;