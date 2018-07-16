const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
	plugins: [
		new CopyWebpackPlugin([
			{
				from: path.join(__dirname, '/../src/main/migrations'),
				to: path.join(__dirname, '/../dist/migrations'),
				ignore: ['.*']
			}
		]),
		new CopyWebpackPlugin([
			{
				from: path.join(__dirname, '/../src/main/seeds'),
				to: path.join(__dirname, '/../dist/seeds'),
				ignore: ['.*']
			}
		]),
		new CopyWebpackPlugin([
			{
				from: path.join(__dirname, '/../src/main/assets'),
				to: path.join(__dirname, '/../dist/assets'),
				ignore: ['.*']
			}
		]),
		new CopyWebpackPlugin([
			{
				from: path.join(__dirname, '/../src/main/utils'),
				to: path.join(__dirname, '/../dist/utils'),
				ignore: ['.*']
			}
		])
	]
};
