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
 * @returns {User}
 * @constructor
 */
function User(data)
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

User.prototype.checkAccess = function (str) {
	return checkAccess(this.lvl, str);
};

User.prototype.isLogin = function () {
	return this._isLogin;
};

User.prototype.update = function () {
	this._date = Date.now();
};

let UserDb = require("./db/User");
User.prototype.sync = async function() {
	let user = await UserDb.getUserByName(this.name);
	User.apply(this, user);
};

User.prototype.isExpired = function () {
	return ((this._date - this._createDate) > USER_EXPIRED_TIMEOUT
			|| this._isDeleteMode);
};

User.prototype.setDeleteMode = function () {
	this._isDeleteMode = true;
};

User.prototype.isSecret = function () {
	return this._isSecret;
};

User.prototype.exit = function () {
	this._isLogin = false;
	this.setDeleteMode();
};

User.prototype.ownBook = function(bookId) {
	return this._books.some((id) => id === bookId);
};

User.prototype.toString = function() {
	return `name: ${this.name}, lvl: ${this.lvl}`;
};

let Book = require("./db/Book");
User.prototype.saveBook = async function(bookId, book) {
    try {
        assert.strictEqual(this.ownBook(bookId), true);
        await Book.saveBook(bookId, book);
        return true;
    } catch (e) {
		debug(`save book user(${this.toString()}) cannot save book: ${e}`);
		return false;
    }
};

User.prototype.timeLeft = function () {
	return this._isDeleteMode ? -1 : this._date - this._createDate;
};

function Guest()
{
	return new User({
		name: "Guest",
		prop: {
			lvl: LVL["GUEST"],
			secret: "guest_secret"
		},
		isLogin: false,
		isDeleteMode: true
	});
}

function SecretUser()
{
	return new User({
		name: "SecretUser",
		isSecret: true,
		prop: {
			lvl: LVL["ADMIN"],
			secret: "secret_secret"
		}
	});
}

SecretUser.SECRET_KEY_FOR_SIGN_IN = process.env.SECRET_KEY_FOR_SIGN_IN;

function VoidUser()
{
	return new User({
		isLogin: false,
		name: "",
		prop: {
			secret: "",
			lvl: LVL["GUEST"]
		}
	})
}



module.exports = {
	User: User,
	Guest: Guest,
	SecretUser: SecretUser,
	VoidUser: VoidUser
};

module.exports.userStorage = userStorage;
module.exports.garbageCollectorForUsers = garbageCollectorForUsers;