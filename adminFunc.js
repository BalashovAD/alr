"use strict";

const debug = require('debug')('sniffer:adminFunc');

let User = require('./mongo').User;
let Book = require('./mongo').Book;

function capitalizeUser()
{
	let cb = arguments.length == 0 ? () => {} : arguments[arguments.length - 1];

	User.find().exec(function (err, users) {
		if (err)
		{
			cb(err);
		}
		else
		{
			users.forEach(function (user) {
				debug('capitalizeUser: user.name = ' + user.name);

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

let userStore = require('./user').userStore;
let garbageCollectorForUsers = require('./user').garbageCollectorForUsers;

function changeUserStore(param)
{
	let cb = arguments.length == 0 ? () => {} : arguments[arguments.length - 1];

	switch(param)
	{
		case 'clearOld':
							garbageCollectorForUsers();

							changeUserStore('info', cb);
							break;
		case 'info':
							let length = Object.keys(userStore).length;
							let retainedSize = length * 6.4 / 1000 / 1000 + 'MB';

							cb(undefined, {
								count: length,
								retainedSize: retainedSize
							});

							break;
		default:
							cb({errmsg:'Wrong params(' + param + ')'});
	}
}

module.exports = {
	capitalizeUser: capitalizeUser,
	changeUserStore: changeUserStore
};