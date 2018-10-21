"use strict";
let mongoose = require("mongoose");
const assert = require("assert");
let fs = require("fs");
let User = require("./User").User;
let debug = require("debug")("sniffer:db:Book");

let schemaBook = {
    title: String,
    author: String,
    link: {
        type: String,
        default: ""
    },
    bookmarks: [{
        title: String,
        text: String,
        pos: Number
    }],
    owner: String,
    pos: Number
};

let book = new mongoose.Schema(schemaBook, {collection: "books"});

book.statics.getBook = async function (bookId) {
    return this.findOne({_id: bookId}).exec();
};

book.statics.deleteBook = async function deleteBook(bookId) {
    return this.getBook(bookId).then((book) => {
        return book.deleteBook();
    });
};

book.methods.deleteBook = async function () {
    let filePath = path.join(__dirname, "files", this.link);

    return User.getUserByName(this.owner).removeBook(this.id).then(() => {
        return this.removeSelf();
    }).then(() => {
        return new Promise(function (resolve, reject) {
            fs.unlink(filePath, function (err) {
                if (err)
                {
                    reject(err);
                }
                else
                {
                    resolve();
                }
            });
        });
    }).catch((err) => {
        debug(`Cannot delete book, path: ${filePath} maybe dangle!\n${err}`);
        throw new MongooseError(`Cannot delete book`);
    });
};


book.methods.removeSelf = removeSelf;

book.statics.addBook = addBook;
book.statics.updateBook = updateBook;
book.statics.deleteBookmark = deleteBookmark;
book.statics.editBookmark = editBookmark;

let Book = mongoose.model("book", book);

async function removeSelf()
{
    return Book.remove({_id: this.id}).exec();
}

function addBook(info)
{
    assert(info && info.title && info.author && info.lnk && info.owner);
    let b = new Book({
        title: info.title,
        author: info.author,
        link: info.lnk,
        bookmark: [],
        owner: info.owner,
        pos: 0
    });

    return b.save().then((book) => {
        if (book && book.id)
        {
            return User.addBook(book.owner, book);
        }
    });
}

function updateBook(id, ss)
{
    assert(ss && (ss.pos > -1 || (ss.bookmarks && ss.bookmarks.length > 0)));
    let nq = {};

    if (ss.pos > -1)
    {
        nq.$set = {
            pos: ss.pos
        }
    }

    if (ss.bookmarks.length > 0)
    {
        nq.$push = {
            bookmarks: {
                $each: ss.bookmarks
            }
        };
    }

    debug(`saveBook ${id}: ${JSON.stringify(ss)}`);
    Book.findOneAndUpdate({_id: id}, nq).exec().then((t) => {
        return User.updateLastBook(t.owner, t.id);
    });
}


async function deleteBookmark(bookId, markId)
{
    let nq = {
        $pull : {
            bookmarks: {
                _id: markId
            }
        }
    };

    return Book.findOneAndUpdate({_id: bookId}, nq).exec();
}

function editBookmark(bookId, mark)
{
    deleteBookmark(bookId, mark.id).then(() => {
        return Book.updateBook(bookId, {
            pos: -1,
            bookmarks: [mark]
        });
    });
}

module.exports.Book = Book;
module.exports.schema = schemaBook;