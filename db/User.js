"use strict";
let mongoose = require("mongoose");
let debug = require("debug")("sniffer:db:User");
let schemaUser = {
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
            default: "0"
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
        default: "0"
    }
};

let user = new mongoose.Schema(schemaUser, {collection: "users"});


user.statics.capitalize = capitalize;

function capitalize(name) {
    if (name !== "")
    {
        return name[0].toUpperCase() + name.substring(1).toLowerCase();
    }
    else
    {
        return "";
    }
}

user.statics.getUserByName = async function(name) {
    name = this.capitalize(name);

    return this.findOne({name: name}).exec();
};

user.statics.getUserById = async function getUserById(id) {
    return this.findOne({_id: id}).exec();
};

user.statics.addUser = addUser;
user.statics.checkUserNameAndSecret = checkUserNameAndSecret;
user.statics.checkUserNameAndPsw = checkUserNameAndPsw;
user.statics.deleteUser = deleteUser;

user.statics.addBook = async function(name, book) {
    return User.update({name: capitalize(name)}, {$push : {
            books: {
                id: book.id,
                title: book.title,
                author: book.author
            }
    }}).exec();
};

user.statics.updateLastBook = async function(name, lastBook) {
    return this.findOneAndUpdate({name: name}, {$set: {lastBook: lastBook}}).exec();
};

user.methods.getSecret = function() {
    return getSecret(capitalize(this.name), this.prop.psw);
};

user.methods.setSecret = function() {
    return setSecret(capitalize(this.name), this.prop.psw);
};

user.methods.removeBook = async function(bookId) {
    this.books = this.books.filter((bookImg) => {
        return bookImg.id !== bookId;
    });

    return this.save();
};

let User = mongoose.model("user", user);

function getSecret(name, psw)
{
    name = capitalize(name);

    psw = psw || "";
    let sha256 = require("crypto").createHash("sha256");
    sha256.update(psw);

    return name + "_" + sha256.digest("hex");
}

function setSecret(name, psw)
{
    User.findOneAndUpdate({name: capitalize(name)}, {
        $set: {
            "prop.secret": getSecret(name, psw)
        }
    }, {multi: false}).exec().catch((err) => {
        debug(`setSecret failed (${err})`);
    });
}

async function deleteUser(id) {
    this.getUserById(id).then((user) => {
        // delete all books
        user.books.forEach(function (id) {
            let Book = require("./Book").Book;
            Book.deleteBook(id);
        });
        // delete this user
        return User.remove({_id: id}).exec();
    });
}

function addUser(name, psw)
{
    let u = new this({
        name: name,
        prop: {
            psw: psw,
            secret: getSecret(name,  psw)
        },
        bookmark: []
    });

    this.findOne({name: capitalize(name)}).select("_id").exec().then(function(t) {
        if (t && t._id)
        {
            throw ({code: 111, errmsg: "This user name {" + name + "} already exist"});
        }
        else
        {
            return u.save();
        }
    });
}

async function checkUserNameAndSecret(name, secret)
{
    try {
        await User.getUserByName(name).then((user) => {
            if (user && user.name && user._id && user.prop
                && (user.prop.secret === secret || user.prop.secret === "0"))
            {
                if (user.prop.secret === "0")
                {
                    this.setSecret(data.name, data.prop.psw);

                    user.prop.secret = this.getSecret(name, data.psw);
                }
            }
            else
            {
                throw new Error(`Secret is wrong(user: ${name}, secret: ${secret})`);
            }
        });

        debug(`checkUserNameAndSecret(${name}, ${secret}) success`);

        return true;
    }
    catch (e) {
        debug(`checkUserNameAndSecret(${name}, ${secret}) fail: ${e}`);

        return false;
    }
}

async function checkUserNameAndPsw(name, psw)
{
    return await checkUserNameAndSecret(name, getSecret(name, psw));
}

module.exports.User = User;
module.exports.schema = schemaUser;