"use strict";

const debug = require("debug")("sniffer:adminFunc");

let User = require("./db/User").User;
let Book = require("./db/Book").Book;

let assert = require("assert");
/**
 * Doesn't work now!
 */
function capitalizeUser()
{
	assert.fail(`Doesn't work now`);
	let cb = arguments.length === 0 ? () => {} : arguments[arguments.length - 1];

	User.find().exec(function (err, users) {
		if (err)
		{
			cb(err);
		}
		else
		{
			users.forEach(function (user) {
				debug("capitalizeUser: user.name = " + user.name);

				User.findOneAndUpdate({
					_id: user._id
				}, {
					$set: {
						name: User.capitalize(user.name),
						"prop.secret": user.getSecret()
					}
				}).exec();
			});
		}
	});

	Book.find().exec(function (err, books) {
		if (err)
		{
			cb(err);
		}
		else
		{
			books.forEach(function (book) {
				Book.findOneAndUpdate({
					_id: book._id
				}, {
					$set: {
						owner: User.capitalize(book.owner)
					}
				}).exec();
			});

			cb();
		}
	})
}

let userStorage = require("./user").userStorage;
let garbageCollectorForUsers = require("./user").garbageCollectorForUsers;

function changeUserStorage(param)
{
	let cb = arguments.length === 0 ? () => {} : arguments[arguments.length - 1];

	let length, retainedSize;

	switch(param)
	{
		case "clearOld":
							garbageCollectorForUsers();

							changeUserStorage("info", cb);
							break;
		case "info":
							length = Object.keys(userStorage).length;
							retainedSize = length * 6.4 / 1000 / 1000 + "MB";

							cb(undefined, {
								count: length,
								retainedSize: retainedSize
							});

							break;
		case "fullInfo":
							length = Object.keys(userStorage).length;
							retainedSize = length * 6.4 / 1000 / 1000 + "MB";
							let users = [];

							for (let i in userStorage)
							{
								users.push({
									name: userStorage[i].name,
									timeLeft: userStorage[i].timeLeft()
								});
							}

							cb(undefined, {
								count: length,
								retainedSize: retainedSize,
								users: users
							});

							break;
		default:
							cb({errmsg:"Wrong params(" + param + ")"});
	}
}

module.exports = {
	capitalizeUser: capitalizeUser,
	__capitalizeUser: {
		description: "Update all data connected with userName. Universalize userName.",
		params: {}
	},
	changeUserStorage: changeUserStorage,
	__changeUserStorage: {
		description: "Command for management userStorage.",
		params: {
			clearOld: "Remove all users from userStorage that expired or were set deleteMode.",
			info: "Return info about allocated memory and count of user.",
			fullInfo: "Return all users and info about allocated memory and count of user."
		}
	},
	__help: {
		description: "Turn on/off helpMode. Autocomplete command and show params.",
		params: {
			on: "Turn on helpMode.",
			off: "Turn off helpMode."
		}
	}
};