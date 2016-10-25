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

module.exports = {
	capitalizeUser: capitalizeUser
};