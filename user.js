"use strict";

const LVL = require("./login").LVL;
const checkAccess = require("./login").checkAccess;
const debug = require("debug")("sniffer:user!constructor");
const assert = require("assert");
const USER_EXPIRED_TIMEOUT = 60 * 60 * 60 * 1000;

let userStorage = Object.create(null);
const GARBAGE_COLLECTOR_TIMEOUT = 60 * 60 * 60 * 100;

/**
 * delete old users (1h now)
 */
function garbageCollectorForUsers() {
	for (let i in userStorage)
	{
		if (userStorage[i].isExpired())
		{
			userStorage[i] = undefined;
			delete userStorage[i];
		}
	}
}

setInterval(garbageCollectorForUsers, GARBAGE_COLLECTOR_TIMEOUT);

/**
 * Create user for store in session
 * @param data - used data._id, data.name, data.prop.lvl, data.prop.secret, data.books
 * @returns {RealUser}
 * @constructor
 */
function RealUser(data)
{
	if (typeof data === "undefined" || typeof data.prop === "undefined")
	{
		return VoidUser();
	}

	this._id = data._id;
	this.name = data.name;
	this.lvl = data.prop.lvl;
	this.secret = data.prop.secret;
	this._isLogin = typeof data.isLogin === "undefined" ? true : data.isLogin;
	this._date = Date.now();
	this._createDate = Date.now();
	this._isDeleteMode = typeof data.isDeleteMode === "undefined" ? false : data.isDeleteMode;
	this._isSecret = typeof data.isSecret === "undefined" ? false : data.isSecret;
	this._books = data.books.map((book) => book.id);

	return this;
}

RealUser.prototype.checkAccess = function (str) {
	return checkAccess(this.lvl, str);
};

RealUser.prototype.isLogin = function () {
	return this._isLogin;
};

RealUser.prototype.update = function () {
	this._date = Date.now();
};

let User = require("./db/User").User;
RealUser.prototype.sync = async function() {
	let user = await User.getUserByName(this.name);
    RealUser.apply(this, user);
};

RealUser.prototype.isExpired = function () {
	return ((this._date - this._createDate) > USER_EXPIRED_TIMEOUT
			|| this._isDeleteMode);
};

RealUser.prototype.setDeleteMode = function () {
	this._isDeleteMode = true;
};

RealUser.prototype.isSecret = function () {
	return this._isSecret;
};

RealUser.prototype.exit = function () {
	this._isLogin = false;
	this.setDeleteMode();
};

RealUser.prototype.ownBook = function(bookId) {
	return this._books.some((id) => id === bookId);
};

RealUser.prototype.toString = function() {
	return `name: ${this.name}, lvl: ${this.lvl}`;
};

let Book = require("./db/Book").Book;
RealUser.prototype.updateBooksPosOrBookmarks = async function(bookId, book) {
    try {
        assert.strictEqual(this.ownBook(bookId), true);
        await Book.updateBook(bookId, book);
        return true;
    } catch (e) {
		debug(`save book user(${this.toString()}) cannot save book: ${e}`);
		return false;
    }
};

RealUser.prototype.timeLeft = function () {
	return this._isDeleteMode ? -1 : this._date - this._createDate;
};

function Guest()
{
	return new RealUser({
		name: "Guest",
		prop: {
			lvl: LVL["GUEST"],
			secret: "guest_secret"
		},
		isLogin: false,
		isDeleteMode: true,
        books: []
	});
}

function SecretUser()
{
	return new RealUser({
		name: "SecretUser",
		isSecret: true,
		prop: {
			lvl: LVL["ADMIN"],
			secret: "secret_secret"
		},
        books: []
	});
}

SecretUser.SECRET_KEY_FOR_SIGN_IN = process.env.SECRET_KEY_FOR_SIGN_IN;

function VoidUser()
{
	return new RealUser({
		isLogin: false,
		name: "",
		prop: {
			secret: "",
			lvl: LVL["GUEST"]
		},
        books: []
	})
}



module.exports = {
    RealUser: RealUser,
	Guest: Guest,
	SecretUser: SecretUser,
	VoidUser: VoidUser
};

module.exports.userStorage = userStorage;
module.exports.garbageCollectorForUsers = garbageCollectorForUsers;