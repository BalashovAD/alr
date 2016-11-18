'use strict';
var mongoose = require('mongoose');
var assert = require('assert');
var path = require('path');
var debug = require('debug')('sniffer:mongo');
// debug = ()=>{};

// const LVL = require('./login').LVL;

var url = process.env.DB_URL || 'mongodb://localhost:27017/alr';

var db = mongoose.connection;

db.on('error', (err) => {
    debug(err);

    throw new Error(err);
});

var schemaUser = {
	name: {
		type: String,
		unique: true,
		required: true,
		get: capitalize,
		set: capitalize
	},
	prop: {
		psw: String,
		secret: {
			type: String,
			default: 0
		},
		lvl: {
			type: Number,
			default: 4
		}
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
	link: {
		type: String,
		default: ''
	},
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


let Models = initModels();


let User =      Models.User,
	Book =      Models.Book,
	Invite =    Models.Invite,
	COL =       Models.COL;

function initModels()
{
	let User, Book, Invite, COL;

	let user = new mongoose.Schema(schemaUser, {collection: 'users'});

	let book = new mongoose.Schema(schemaBook, {collection: 'books'});

	let invite = new mongoose.Schema(schemaInvite, {collection: 'invites'});

	// statics
	user.statics.capitalize = capitalize;
	user.statics.addUser = addUser;
	user.statics.checkUserNameAndSecret = checkUserNameAndSecret;
	user.statics.checkUserNameAndPsw = checkUserNameAndPsw;
	user.statics.getUser = getUser;
	user.statics.deleteUser = deleteUser;

	book.statics.getBook = getBook;
	book.statics.deleteBook = deleteBook;
	book.statics.addBook = addBook;
	book.statics.saveBook = saveBook;
	book.statics.deleteBookmark = deleteBookmark;
	book.statics.editBookmark = editBookmark;

	invite.statics.findAndModify = function (query, doc, callback) {
		return this.collection.findAndModify(query, [], doc, true, callback);
	};

	invite.statics.getInvite = function (val, cb) {
		Invite.findOne({value: val}).exec(cb);
	};

	// methods
	user.methods.getSecret = function() {
		return getSecret(capitalize(this.name), this.prop.psw);
	};
	user.methods.setSecret = function() {
		return setSecret(capitalize(this.name), this.prop.psw);
	};



	invite.methods.checkInvite = function () {
		return checkInvite(this);
	};
	invite.methods.dec = function(user) {
		decInvite(this, user);
	};



	Book = mongoose.model('book', book);
	User = mongoose.model('user', user);
	Invite = mongoose.model('invite', invite);

	COL = {
		'user': User,
		'book': Book,
		'invite': Invite
	};

	return {
		User: User,
		Book: Book,
		Invite: Invite,
		COL: COL
	};
}


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

function capitalize(name) {
	if (name != '')
	{
		return name[0].toUpperCase() + name.substring(1).toLowerCase();
	}
	else
	{
		return '';
	}
}

db.once('open', function() {
	debug('Connection to db open.');
});


function getSecret(name, psw)
{
	name = capitalize(name);

	psw = psw || '';
	let sha256 = require('crypto').createHash('sha256');
	sha256.update(psw);

	return name + '_' + sha256.digest('hex');
}

mongoose.connect(url);

function addUser(name, psw, cb)
{
    let u = new User({
        name: name,
        prop: {
            psw: psw,
            secret: getSecret(name,  psw)
        },
        bookmark: []
    });

    User.findOne({name: capitalize(name)}).select('_id').exec(function(err, t) {
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

function setSecret(name, psw)
{
	User.findOneAndUpdate({name: capitalize(name)}, {
		$set: {
			"prop.secret": getSecret(name, psw)
		}
	}, {multi: false}).exec();
}

function checkUserNameAndSecret(name, secret, cb)
{
    let u = User.findOne({name: capitalize(name)});

    let q = u.select('_id name prop');

    q.exec(function(err, data) {
	    if (err)
	    {
		    cb(err);
	    }
	    else
	    {
		    if (data && data.prop && (data.prop.secret == secret || data.prop.secret == 0))
		    {
			    if (data.prop.secret == 0)
			    {
				    setSecret(data.name, data.prop.psw);

				    data.prop.secret = getSecret(name, data.psw);
			    }

			    cb(err, data);
		    }
		    else
		    {
			    cb(err);
		    }
	    }
    });
}

function checkUserNameAndPsw(name, psw, cb)
{
	checkUserNameAndSecret(name, getSecret(name, psw), cb);
}

function checkInvite(inv)
{
	return (inv && inv.counter && inv.counter > 0);
}

function decInvite(inv, user)
{
	if (inv && inv.counter && inv.counter > 0)
	{
		Invite.findOneAndUpdate({value: inv.value}, {
			counter: inv.counter - 1,
			$push: {
				users: {
					id: user.id
				}
			}
		}, function(err) {
			if (err)
			{
				user.delete();
			}
			else
			{
				// all right
				debug('Registration {name: ' + user.name + '} finished');
			}
		});
	}
	else
	{
		user.delete();
	}
}

function getUser(name, cb)
{
    let u = User.findOne({name: capitalize(name)});

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
            User.update({name: capitalize(book.owner)}, {$pull: {
                books: {
                    id: id
                }
            }
            }, cb);
        }
        else
        {
            if (book && (anyway || (book && book.owner && book.owner == name)))
            {

	            Book.find({link: book.link}).exec(function (err, booksWithThisLink) {
		            if (err)
		            {
			            debug(err);
		            }
		            else
		            {
			            if (booksWithThisLink.length <= 1 && book.link)
			            {
				            let filePath = path.join(__dirname, 'files', book.link);

				            fs.unlink(filePath, function (err) {
					            if (err)
					            {
						            debug(err);
					            }
				            });
			            }

			            Book.remove({_id: id}).exec(function (err) {
				            if (err)
				            {
					            debug(err);
				            }
			            });
		            }
	            });



                User.update({name: capitalize(book.owner)}, {$pull: {
                        books: {
                            id: id
                        }
                    }
                }, {multi: true}, cb);

            }
            else
            {
                if (!book)
                {
                    User.update({name: capitalize(name)}, {
	                    $pull: {
                            books: {
                                id: id
                            }
                        }
                    }, cb);
                }
	            else
                {
	                cb({
						errmsg: 'Ur not owner this book'
	                });
                }
            }
        }
    })
}

function deleteUser(id, name, cb, anyway)
{
    User.findOne({_id: id}).exec((err, user) => {
        if (err)
        {
            cb(err);
        }
        else
        {
            if (user && (anyway || user && user.name && user.name == name))
            {
                // delete all books
                user.books.forEach(function (id) {
	                deleteBook(id, name, cb, true);
                });
                // remove this user from invite
                Invite.findAndModify({user: {
                    $elemMatch: {
                        id: user.id
                    }
                }}, {user: {
                    $pullAll: {
                        id: user.id
                    }
                }}, function (err) {
	                if (err)
	                {
		                debug(err);
	                }
                });
                // delete this user
                User.remove({_id: id}).exec(cb);
            }
	        else
            {
	            cb();
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
                User.update({name: capitalize(info.owner)}, {$push : {
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
            User.update({name: capitalize(name)}, {$set: {lastBook: id}}, cb);
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

    let u = User.findOne({name: capitalize(name)});

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


function getById(col, id, cb)
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

module.exports.User = User;
module.exports.Book = Book;
module.exports.Invite = Invite;

module.exports.getById = getById;
module.exports.getCol = getCol;
module.exports.deleteById = deleteById;
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
















