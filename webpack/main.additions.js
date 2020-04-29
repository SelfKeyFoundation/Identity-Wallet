const CopyWebpackPlugin = require('copy-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const path = require('path');

module.exports = {
	module: {
		rules: [
			{
				test: /\.(jsx?|tsx?|vue)$/,
				enforce: 'pre',
				include: /src/,
				loader: 'eslint-loader',
				options: {
					cwd: path.resolve(__dirname, '..'),
					formatter: require('eslint-friendly-formatter'),
					configFile: path.resolve(__dirname, '..', '.eslintrc.json')
				}
			}
		]
	},
	plugins: [
		new HardSourceWebpackPlugin(),

		new CopyWebpackPlugin([
			{
				from: path.join(__dirname, '/../src/main/migrations'),
				to: path.join(__dirname, '/../dist/main/migrations'),
				ignore: ['.*']
			}
		]),
		new CopyWebpackPlugin([
			{
				from: path.join(__dirname, '/../src/main/seeds'),
				to: path.join(__dirname, '/../dist/main/seeds'),
				ignore: ['.*']
			}
		]),
		new CopyWebpackPlugin([
			{
				from: path.join(__dirname, '/../src/main/assets'),
				to: path.join(__dirname, '/../dist/main/assets'),
				ignore: ['.*']
			}
		]),
		new CopyWebpackPlugin([
			{
				from: path.join(__dirname, '/../src/common/utils'),
				to: path.join(__dirname, '/../dist/common/utils'),
				ignore: ['.*']
			}
		])
	],
	resolve: {
		modules: [path.resolve(__dirname, '..', 'src'), 'node_modules'],
		extensions: ['.js', '.jsx', '.css', '.svg', '.json']
	}
};
