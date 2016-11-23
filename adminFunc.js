"use strict";

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
				User.findOneAndUpdate({
					_id: user._id
				}, {
					$set: {
						name: User.capitalize(user.name),
						"prop.secret": user.getSecret()
					}
				});
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
				});
			});

			cb();
		}
	})
}

let userStore = require('./user').userStore;
let garbageCollectorForUsers = require('./user').garbageCollectorForUsers;

function changeUserStore(cmd)
{
	let cb = arguments.length == 0 ? () => {} : arguments[arguments.length - 1];

	if (cmd == 'clearAllOld')
	{
		garbageCollectorForUsers();

		cb();
	}
	else
	{
		if (cmd == 'info')
		{
			let length = Object.keys(userStore).length;
			let retainedSize = length * 6.4 / 1000 / 1000 + 'MB';

			cb(undefined, {
				count: length,
				retainedSize: retainedSize
			});
		}
	}
}

module.exports = {
	capitalizeUser: capitalizeUser,
	changeUserStore: changeUserStore
};