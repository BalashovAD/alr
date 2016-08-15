"use strict";
var app = require('express')();
var cookieParser = require('cookie-parser');
var path = require('path');
var fs = require('fs');

var debug = require('debug')('sniffer:book');

app.use(cookieParser());

var checkAccess = require('./login').checkAccess;
var addBook = require('./mongo').addBook;
var saveBook = require('./mongo').saveBook;
var getBook = require('./mongo').getBook;
var deleteBookmark = require('./mongo').deleteBookmark;
var editBookmark = require('./mongo').editBookmark;


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

app.get('/', (req, res, next) => {
    res.set('Content-Type', 'text/html');

    res.render('addBook.jade', {
        title: 'Add book',
        name: req.userName
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
var MAX_FILE_SIZE = 2.4 * 1000 * 1000;

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

    busboy.on('file', function(fieldName, file, filename, encoding, mimetype) {

        debug(JSON.stringify({fieldName, filename, encoding, mimetype}));

        let len = 0;
        if (fieldName == 'book')
        {/*
            file.on('data', function(data) {
                len += data.length;
                if (len > MAX_FILE_SIZE)
                {
                    busboy.abort();
                }
            });*/


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

            res.status(500).redirect('/book/');
        }
        else
        {
            next();
        }
    });


    return req.pipe(busboy);
}

// Add book
// :title - title in list
app.post('/add/', getFile, function(req, res, next) {
    let title = req.body.title || "";
    let author = req.body.author || "";
// TODO: form upload

    debug('Path = ' + req.lnkBook);


    addBook({
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
    function db_cb(err, t)
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
    if (id == 0)
    {
        res.status(301).end();

        next();
        return;
    }

    for (let k in allowedParams)
    {
        if (req.body.hasOwnProperty(allowedParams[k]))
        {
            ss[allowedParams[k]] = req.body[allowedParams[k]];
        }
    }

    debug(ss);

    saveBook(id, req.userName, ss, (err, t) => {
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
 */

app.post('/bookmark/delete/_:id', function(req, res, next){
    let id = req.params.id;
    let markId = req.body.markId;

    debug('bookId = %s, markId = %s', id, markId);

    if (typeof markId == 'undefined')
    {
        res.status(401).end();

        return;
    }

    deleteBookmark(id, req.userName, markId, function(err){
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

app.post('/bookmark/edit/_:id', function(req, res, next){
    let id = req.params.id;
    let mark = req.body.mark;

    debug('/bookmark/edit/_:id  :id = %s, mark = %s', id, JSON.stringify(mark));

    editBookmark(id, req.userName, mark, function(err){
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

app.get('/bookmark/get/_:id', function(req, res, next) {
    let id = req.params.id;

    debug('/bookmark/get/_:id  :id = %s', id);

    getBook(id, req.userName, function(err, t) {
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
app.get('/info/_:id', function(req, res, next) {
    let id = req.params.id;

    getBook(id, req.userName, function(err, t) {
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