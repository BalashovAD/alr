"use strict";
let path = require("path");
let webpack = require("webpack");

module.exports = {
	context: path.join(__dirname, "public", "js"),
	entry: {
		bookReader: "./init.js",
		login: "./login-page.js",
		registration: "./registration.js",
		adminPanel: "./adminPanel.js"
	},
	output: {
		path: path.join(__dirname, "public", "js", "build"),
		filename: "[name].js",
		library: "__" // TODO: _ -> tictactoe
	},
	watch: true,
	watchOptions: {
		aggregateTimeout: 6000
	},
	resolve: {
		modulesDirectories: [
			path.join(__dirname, "node_modules")
		]
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: "jquery/dist/jquery.min.js",
			jQuery: "jquery/dist/jquery.min.js",
			"window.jQuery": "jquery/dist/jquery.min.js"
		})
	],
	module: {
		loaders: [{
				test: /\.js$/,
				include: [
					path.resolve(__dirname, "public", "js")
				],
				exclude: path.resolve(__dirname, "/node_modules/"),
				loader: "babel?presets[]=es2015"
			}, {
				test: /\.png$/,
				loader: "file?name=/../images/[name].[ext]"
			}
		]
	},
	devtool: "source-map"
};