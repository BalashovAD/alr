"use strict";
let mongoose = require("mongoose");
let assert = require("assert");
let path = require("path");
let debug = require("debug")("sniffer:mongo");
// debug = ()=>{};

// const LVL = require("./login").LVL;

let url = process.env.DB_URL || "mongodb://localhost:27017/alr";

let db = mongoose.connection;

db.on("error", (err) => {
    debug(err);

    throw new Error(err);
});


let schemaInvite = {
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
	let Invite, COL;

	let invite = new mongoose.Schema(schemaInvite, {collection: "invites"});

	invite.statics.findAndModify = function (query, doc, callback) {
		return this.collection.findAndModify(query, [], doc, true, callback);
	};

	invite.statics.getInvite = function (val, cb) {
		Invite.findOne({value: val}).exec(cb);
	};

	invite.methods.checkInvite = function () {
		return checkInvite(this);
	};
	invite.methods.dec = function(user) {
		decInvite(this, user);
	};

	Invite = mongoose.model("invite", invite);

	let User = require("./User").User;
	let Book = require("./Book").Book;

	COL = {
		"user": User,
		"book": Book,
		"invite": Invite
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
            if (typeof obj[key] === "function")
            {
                r[key] = obj[key].name;
            }
            else if (typeof obj[key] === "object" && obj[key][0])
            {// when it"s array
                r[key] = jsonPrep(obj[key][0]);
                r["__" + key] = "array";
            }
            else if (typeof obj[key] === "object" && obj[key].type)
            {// when type is .type and other r settings
                r[key] = obj[key].type.name;
                if (obj[key].default)
                    r["__" + key] = obj[key].default;
            }
            else if (typeof obj[key] === "object")
            {// type is obj
                r[key] = jsonPrep(obj[key]);
            }
        }
    }

    return r;
}



db.once("open", function() {
	debug("Connection to db open.");
});


mongoose.connect(url, {useNewUrlParser: true});

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
				debug("Registration {name: " + user.name + "} finished");
			}
		});
	}
	else
	{
		user.delete();
	}
}



function getById(col, id)
{
    let qq = COL[col].findOne({_id: id}).select("-__v");

    return qq.exec();
}

function getCol(col)
{
    let qq = COL[col].find().select("-__v");

    return qq.exec();
}

function deleteById(col, id)
{
    switch(col)
    {
        case "book":
                     return Book.deleteBook(id);
        case "user":
                     return User.deleteUser(id);
        case "invite":
                     return Invite.remove({_id: id}).exec();
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
    schema: jsonPrep(require("./User").schema),
    name: "user"
}, {
    schema: jsonPrep(require("./Book").schema),
    name: "book"
}, {
    schema: jsonPrep(schemaInvite),
    name: "invite"
}];
















