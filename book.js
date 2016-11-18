"use strict";
var app = require('express')();
var cookieParser = require('cookie-parser');
var path = require('path');
var fs = require('fs');

var debug = require('debug')('sniffer:book');

app.use(cookieParser());

var checkAccess = require('./login').checkAccess;
let Book = require('./mongo').Book;

/**
 * Check existence of a folder{pp}
 * if not exist then create
 * It's async version
 * @param pp - string, path of folder
 * @param next - cb
 * @throw err if can not create directory or fs error
 */
function checkFolder(pp, next)
{
    if (arguments.length < 2)
    {
        next = ()=>{};
    }

    fs.stat(pp, function(err, stat) {
        if (err)
        {// try create dir
            fs.mkdir(pp, function(err, folder) {
                if (err)
                {
                    //TODO: emmit system error
                    throw new Error('System error{fs.mkdir}. path = ' + pp);
                }
                else
                {
                    debug('Create folder: path = ' + pp);
                    next();
                }
            });
        }
        else
        {
            if (stat.isDirectory())
            {
                next();
            }
            else
            {// try create dir
                fs.mkdir(pp, function(err, folder) {
                    if (err)
                    {
                        //TODO: emmit system error
                        throw new Error('System error{fs.mkdir}. path = ' + pp);
                    }
                    else
                    {
                        debug('Create folder: path = ' + pp);
                        next();
                    }
                });
            }
        }
    });
}

checkFolder('./files');

app.use(require('body-parser').json());

// Access for USER
app.all('*', (req, res, next) => {
    if (checkAccess(req.lvl, 'addBook'))
    {
        next();
    }
    else
    {
        res.status(401).json({
            err: 1,
            errmsg: 'No access'
        }).end();
    }
});

app.get('/', (req, res) => {
    res.set('Content-Type', 'text/html');

    res.render('addBook.jade', {
        title: 'Add book',
        name: req.userName,
	    error: (req.query || {})['error']
    });
});

var fileCounter = 0;


app.post('/add/*', function(req, res, next){
    if (req.userName && req.userName != '0')
    {
        checkFolder('./files/' + req.userName, next);
    }
    else
    {
        res.status(400).end();
    }
});

var Busboy = require('busboy');
var inspect = require('util').inspect;
var MAX_FILE_SIZE_IN_MB = 2.4;
var MAX_FILE_SIZE = MAX_FILE_SIZE_IN_MB * 1024 * 1024;

function getFile(req, res, next)
{

    let date = Date.now();


    let lnk = path.join(req.userName, req.userName + '__' + date + '_' + fileCounter + ".fb2");

    let pp = path.join(__dirname, '/files/', lnk);

    req.lnkBook = lnk;

    ++fileCounter;

    var busboy = new Busboy({
        headers: req.headers,
        limits: {
            fileSize: MAX_FILE_SIZE,
            files: 1
        }
    });

    // if true - delete loaded file
    let isDelete = false;
	let len = 0;

    busboy.on('file', function(fieldName, file, filename, encoding, mimetype) {

        debug(JSON.stringify({fieldName, filename, encoding, mimetype}));

        if (fieldName == 'book')
        {
            file.on('data', function(data) {
                len += data.length;
                if (len > MAX_FILE_SIZE)
                {
                    busboy.abort();
                }
            });


            file.on('limit', function() {
                debug('Out of limits. FIle = ' + filename);

                isDelete = true;
            });


            file.pipe(fs.createWriteStream(pp));
        }
    });

    busboy.on('field', function(field, val) {
        debug('Field [' + field + ']: value: ' + inspect(val));

        req.body[field] = val;
    });

    busboy.on('aborted', function() {
        req.status(403).end();
    });

    busboy.on('finish', function() {
        if (isDelete)
        {
            fs.unlink(pp);

            res.status(500).redirect('/book/?error=File size limit. Max size = ' + MAX_FILE_SIZE_IN_MB + 'MB.');
        }
        else
        {
            next();
        }
    });


    return req.pipe(busboy);
}

/**
 * @body title
 * @body author
 */
app.post('/add/', getFile, function(req, res) {
    let title = req.body.title || "";
    let author = req.body.author || "";
// TODO: form upload

    debug('Path = ' + req.lnkBook);


	Book.addBook({
        title: title,
        author: author,
        owner: req.userName,
        lnk: req.lnkBook
    }, db_cb);

/*
    fileBook.mv(pp, function(err) {
        if (err)
        {
            res.status(500).redirect('/book/');
        }
        else
        {
            addBook({
                title: title,
                author: author,
                owner: req.userName,
                lnk: lnk
            }, db_cb);
        }
    });
// TODO: convert files to fb2
*/
    function db_cb(err)
    {
        if (err)
        {
            res.status(500).redirect('/book/');
        }
        else
        {
            res.status(200).redirect('/');
        }
    }

});


app.post('/save/_:id', (req, res, next) => {
    let ss = {};
    let id = req.params.id;
    let allowedParams = ['pos', 'bookmarks'];

    debug('Save book _id = %s, user = %s', id, req.userName);

    // If no book
    if (typeof id == 'undefined' || id == 0)
    {
        res.status(301).end();

        next();
        return;
    }

    for (let k in allowedParams) {
	    if (allowedParams.hasOwnProperty(k))
	    {
		    if (req.body.hasOwnProperty(allowedParams[k]))
		    {
			    ss[allowedParams[k]] = req.body[allowedParams[k]];
		    }
	    }
    }

    debug(ss);

	Book.saveBook(id, req.userName, ss, (err, t) => {
        if (err)
        {
            debug(err);

            res.status(500).end();
        }
        else
        {
            if (t)
            {
                res.status(200).end();
            }
            else
            {
                res.status(401).end();
            }
        }
    });
});

/** Bookmark
 *  @param :id - book id
 *  @body markId
 */
app.post('/bookmark/delete/_:id', function(req, res){
    let id = req.params.id;
    let markId = req.body.markId;

    debug('Delete bookmark. bookId = %s, markId = %s', id, markId);

    if (typeof markId == 'undefined')
    {
        res.status(401).end();

        return;
    }

    Book.deleteBookmark(id, req.userName, markId, function(err){
        if (err)
        {
            res.status(401).end();
        }
        else
        {
            res.status(200).end();
        }
    });
});

app.post('/bookmark/edit/_:id', function(req, res){
    let id = req.params.id;
    let mark = req.body.mark;

    debug('/bookmark/edit/_:id  :id = %s, mark = %s', id, JSON.stringify(mark));

    Book.editBookmark(id, req.userName, mark, function(err){
        if (err)
        {
            res.status(401).end();
        }
        else
        {
            res.status(200).end();
        }
    });
});

app.get('/bookmark/get/_:id', function(req, res) {
    let id = req.params.id;

    debug('/bookmark/get/_:id  :id = %s', id);

    Book.getBook(id, req.userName, function(err, t) {
        if (err)
        {
            res.status(401).json(err).end();
        }
        else
        {
            res.json(t.bookmarks).end();
        }
    });
});

// Get info about book
// :id - book id in db
app.get('/info/_:id', function(req, res) {
    let id = req.params.id;

    Book.getBook(id, req.userName, function(err, t) {
        if (err)
        {
            res.status(401).json(err).end();
        }
        else
        {
            res.json(t).end();
        }
    });
});

module.exports.app = app;