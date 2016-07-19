"use strict";
var mongoose = require('mongoose');
var assert = require('assert');
var path = require('path');
var debug = require('debug')('sniffer:mongo');
debug = ()=>{};

var LVL = require('./login').LVL;

var url = process.env.DB_URL || 'mongodb://localhost:27017/alr';

var db = mongoose.connection;

db.on('error', (err) => {
    debug(err);

    throw new Error(err);
});

var Book;
var User;

db.once('open', function() {
    var user = new mongoose.Schema({
        name: String,
        prop: {
            psw: String,
            secret: String,
            lvl: Number
        },
        books: [{
            id: String,
            title: String,
            author: String
        }],
        lastBook: String
    }, {collection: 'users'});

    var book = new mongoose.Schema({
        title: String,
        author: String,
        link: String,
        bookmarks: [{
            title: String,
            text: String,
            pos: Number
        }],
        owner: String,
        pos: Number
    }, {collection: 'books'});

    Book = mongoose.model('book', book);
    User = mongoose.model('user', user);

});

mongoose.connect(url);

function addUser(name, psw, cb)
{
    let sha256 = require('crypto').createHash('sha256');
    sha256.update(psw);

    var LVL = require('./login').LVL;

    let u = new User({
        name: name,
        prop: {
            psw: psw,
            secret: name + '_' + sha256.digest('hex'),
            lvl: LVL['USER']
        },
        bookmark: [],
        lastBook: 0
    });

    u.save(cb);
}

function checkUser(name, cb)
{
    let u = User.findOne({name: name});

    let q = u.select('name prop');

    q.exec(cb);
}

function getUser(name, cb)
{
    let u = User.findOne({name: name});

    let q = u.select('name prop.lvl books lastBook');

    q.exec(cb);
}

var fs = require('fs');

function deleteBook(id, name, cb, anyway)
{
    let b = Book.findOne({_id: id});

    b.select('owner link').exec(function(err, book) {
        if (err)
        {
            cb(err);
        }
        else
        {
            if (anyway || book && book.owner && book.owner == name)
            {
                User.update({name: book.owner}, {$pull: {
                        books: {
                            id: id
                        }
                    }
                }, {multi: true}, function (err, t) {

                    User.findOne({books: {$elemMatch: {id: id}}}).select('_id').exec(function(err, s) {
                        if (err)
                        {
                            cb(err);
                        }
                        else
                        {
                            if(s && s._id)
                            {
                                cb(err, s);
                            }
                            else
                            {
                                Book.findOne({_id: id}).remove(function(err, i) {
                                    if (err)
                                    {
                                        cb(err);
                                    }
                                    else
                                    {
                                        let filePath = path.join(__dirname, 'files', book.link);

                                        fs.unlink(filePath, cb);
                                    }
                                });
                            }
                        }
                    });
                });
            }
            else
            {
                if (!book)
                {
                    cb();
                }
            }
        }
    })
}

function addBook(info, cb)
{
    let b = new Book({
        title: info.title,
        author: info.author,
        link: info.lnk,
        bookmark: [],
        owner: info.owner,
        pos: 0
    });

    b.save(function (err, t) {
        if (err)
        {
            cb(err);
        }
        else
        {
            if (t && t.id)
            {
                User.update({name: info.owner}, {$push : {
                    books: {
                        id: t.id,
                        title: t.title,
                        author: t.author
                    }
                }}, function (err) {
                    cb(err, t);
                });
            }
        }
    });
}

function saveBook(id, name, ss, cb, anyway)
{
    let q = {_id: id};
    if (anyway)
    {
        // Do nothing
    }
    else
    {
        q.owner = name;
    }

    let nq = {};

    if (ss && ss.pos && ss.pos > -1)
    {

        nq.$set = {
            pos: ss.pos
        }

    }

    if (ss && ss.bookmarks)
    {
        nq.$pushAll = {
            bookmarks: ss.bookmarks
        }
    }

    debug('saveBook: nq = ' + nq);

    Book.findOneAndUpdate(q, nq, (err, t) => {
        debug(err, t, name);

        if (!err && t && name == t.owner)
        {
            debug(err, t);

            User.update({name: name}, {$set: {lastBook: id}}, cb);
        }
        else
        {
            cb(err, t);
        }
    });
}

function deleteBookmark(bookId, name, markId, cb, anyway)
{
    let q = {_id: bookId};
    if (anyway)
    {
        // Do nothing
    }
    else
    {
        q.owner = name;
    }

    let nq = {
        $pull : {
            bookmarks: {
                _id: markId
            }
        }
    };

    Book.findOneAndUpdate(q, nq, (err, t) => {
        debug(err, t, name);

        if (!err && t && name == t.owner)
        {
            debug(err, t);

            cb(err, t);
        }
        else
        {
            cb(err, t);
        }
    });
}

function editBookmark(bookId, name, mark, cb, anyway)
{
    deleteBookmark(bookId, name, mark.id, function(err){
        if (err)
        {
            debug(err);

            cb(err);
        }
        else
        {
            saveBook(bookId, name, {
                pos: -1,
                bookmarks: [mark]
            }, cb, anyway);
        }
    }, anyway);
}

function getBook(id, name, cb, anyway)
{
    let b = Book.findOne({_id: id});

    let q = b.select('_id title author link bookmarks owner pos');

    let u = User.findOne({name: name});

    let qu = u.select('books');

    qu.exec(function(err, t) {
        if (err)
        {
            cb(err);
        }
        else
        {
            if (t && typeof t.books)
            {
                if(anyway || t.books.find((e) => {return e.id == id;}))
                {
                    q.exec(cb);
                }
                else
                {
                    cb({err: 1, errmsg: 'You don`t own this book.'})
                }
            }
        }
    })
}

module.exports.addUser = addUser;
module.exports.checkUser = checkUser;
module.exports.addBook = addBook;
module.exports.getBook = getBook;
module.exports.getUser = getUser;
module.exports.deleteBook = deleteBook;
module.exports.saveBook = saveBook;
module.exports.deleteBookmark = deleteBookmark;
module.exports.editBookmark = editBookmark;


















