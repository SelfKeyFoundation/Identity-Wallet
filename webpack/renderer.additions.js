const path = require('path');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = {
	module: {
		rules: [
			{
				test: /\.(jsx?|tsx?|vue)$/,
				enforce: 'pre',
				include: /src/,
				loader: 'eslint-loader',
				options: {
					fix: true,
					cwd: path.resolve(__dirname, '..'),
					configFile: path.resolve(__dirname, '..', '.eslintrc.json')
				}
			},
			{
				test: /\.jsx?$/,
				loader: 'babel-loader',
				include: /src/,
				options: {
					presets: ['@babel/react']
				}
			},
			{
				test: /\.css$/,
				include: [
					path.resolve(__dirname, 'src'),
					path.resolve(__dirname, 'node_modules/selfkey-ui/')
				],
				use: ['style-loader', 'css-loader']
			}
		]
	},
	plugins: [new HardSourceWebpackPlugin()],
	resolve: {
		modules: [path.resolve(__dirname, '..', 'src'), 'node_modules'],
		extensions: ['.js', '.jsx', '.css']
	}
};
