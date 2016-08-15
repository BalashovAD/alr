"use strict";
var mongoose = require('mongoose');
var assert = require('assert');
var path = require('path');
var debug = require('debug')('sniffer:mongo');
// debug = ()=>{};

var LVL = require('./login').LVL;

var url = process.env.DB_URL || 'mongodb://localhost:27017/alr';

var db = mongoose.connection;

db.on('error', (err) => {
    debug(err);

    throw new Error(err);
});

var Book;
var User;
var Invite;

var COL;

function jsonPrep(obj)
{
    let r = {};
    for (let key in obj)
    {
        if (obj.hasOwnProperty(key))
        {
            if (typeof obj[key] === 'function')
            {
                r[key] = obj[key].name;
            }
            else if (typeof obj[key] === 'object' && obj[key][0])
            {// when it's array
                r[key] = jsonPrep(obj[key][0]);
                r['__' + key] = 'array';
            }
            else if (typeof obj[key] === 'object' && obj[key].type)
            {// when type is .type and other r settings
                r[key] = obj[key].type.name;
                if (obj[key].default)
                    r['__' + key] = obj[key].default;
            }
            else if (typeof obj[key] === 'object')
            {// type is obj
                r[key] = jsonPrep(obj[key]);
            }
        }
    }

    return r;
}

var schemaUser = {
    name: {
        type: String,
        unique: true
    },
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
    lastBook: {
        type: String,
        default: 0
    }
};

var schemaBook = {
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
};

var schemaInvite = {
    value: {
        type: String,
        unique: true
    },
    counter: {
        type: Number,
        default: 5,
        min: 0
    },
    users: [{
        id: String
    }]
};

db.once('open', function() {
    let user = new mongoose.Schema(schemaUser, {collection: 'users'});

    let book = new mongoose.Schema(schemaBook, {collection: 'books'});

    let invite = new mongoose.Schema(schemaInvite, {collection: 'invites'});

    invite.statics.findAndModify = function (query, doc, callback) {
        return this.collection.findAndModify(query, [], doc, true, callback);
    };

    Book = mongoose.model('book', book);
    User = mongoose.model('user', user);
    Invite = mongoose.model('invite', invite);


    COL = {
        'user': User,
        'book': Book,
        'invite': Invite
    };
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

    User.findOne({name: name}).select('_id').exec(function(err, t) {
        if (err)
        {
            cb(err);
        }
        else
        {
            if (t && t._id)
            {
                cb({code: 111, errmsg: 'This user name {' + name + '} already exist'});
            }
            else
            {
                u.save(cb);
            }
        }
    });

}

function checkUser(name, cb)
{
    let u = User.findOne({name: name});

    let q = u.select('_id name prop');

    q.exec(cb);
}

function checkInvite(inv, cb)
{
    let i = Invite.findOne({value: inv});

    let q = i.select('value counter');

    q.exec(function(err, t) {
        if (err)
        {
            cb(err);
        }
        else
        {
            if (t && t.counter && t.counter > 0)
            {
                cb(err, t);
            }
            else
            {
                cb({code: 111, errmsg: 'Invitation is spoiled'});
            }
        }
    });
}

function decInvite(inv, id, cb)
{
    let i = Invite.findOne({value: inv});

    let q = i.select('value counter');

    q.exec(function(err, t) {
        if (err)
        {
            cb(err);
        }
        else
        {
            if (t && t.counter && t.counter > 0)
            {
                Invite.findOneAndUpdate({value: inv}, {
                    counter: t.counter - 1,
                    $push: {
                        users: {
                            id: id
                        }
                    }
                }, cb);
            }
            else
            {
                // delete user._id = id
                cb({code: 111, errmsg: 'Invitation is spoiled'});
            }
        }
    });
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
            User.update({name: book.owner}, {$pull: {
                books: {
                    id: id
                }
            }
            }, cb);
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

                                        fs.unlink(filePath, function(err, t) {
                                            cb();
                                        });
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
                    User.update({name: name}, {$pull: {
                        books: {
                            id: id
                        }
                    }
                    }, cb);
                }
            }
        }
    })
}

function deleteUser(id, name, cb, anyway)
{
    let nowReady = 0;

    function checkCb(err, t)
    {
        if (nowReady >= 2) // magic number
        {
            cb(err, t);
        }
        else
        {
            ++nowReady;
        }
    }

    User.findOne({_id: id}).exec((err, t) => {
        if (err)
        {
            cb(err);
        }
        else
        {
            if (anyway || t && t.name && t.name == name)
            {
                // delete all books
                Book.remove({owner: t.name}).exec(checkCb);
                // remove this user from invite
                Invite.findAndModify({user: {
                    $elemMatch: {
                        id: t.id
                    }
                }}, {user: {
                    $pullAll: {
                        id: t.id
                    }
                }}, checkCb);
                // delete this user
                User.remove({_id: id}).exec(checkCb);
            }
        }
    });
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
        if (!err && t && name == t.owner)
        {
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


function getColById(col, id, cb)
{
    let qq = COL[col].findOne({_id: id}).select('-__v');

    qq.exec(cb);
}

function getCol(col, cb)
{
    let qq = COL[col].find().select('-__v');

    qq.exec(cb);
}

function deleteById(col, id, cb)
{
    switch(col)
    {
        case 'book':
                     deleteBook(id, false, cb, true);
                     break;
        case 'user':
                     deleteUser(id, false, cb, true);
                     break;
        case 'invite':
                     Invite.remove({_id: id}).exec(cb);
                     break;
    }
}

function addDoc(col, doc, cb)
{
    let u = new COL[col](doc);

    u.save(cb);
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
module.exports.checkInvite = checkInvite;
module.exports.decInvite = decInvite;
module.exports.getColById = getColById;
module.exports.getCol = getCol;
module.exports.deleteById = deleteById;
module.exports.deleteUser = deleteUser;
module.exports.addDoc = addDoc;

module.exports.schemas = [{
    schema: jsonPrep(schemaUser),
    name: "user"
}, {
    schema: jsonPrep(schemaBook),
    name: "book"
}, {
    schema: jsonPrep(schemaInvite),
    name: "invite"
}];
















