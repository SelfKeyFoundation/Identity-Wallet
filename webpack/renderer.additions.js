const path = require('path');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = {
	module: {
		rules: [
			{
				test: /\.(jsx?|tsx?|vue)$/,
				enforce: 'pre',
				include: [/src/],
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
				include: [
					path.resolve(__dirname, '../src'),
					path.resolve(__dirname, '../node_modules/selfkey-ui/')
				],
				options: {
					presets: ['@babel/react']
				}
			},
			{
				test: /\.svg$/,
				include: [
					path.resolve(__dirname, '../src'),
					path.resolve(__dirname, '../node_modules/selfkey-ui/')
				],
				loader: 'svg-inline-loader'
			},
			{
				test: /\.css$/,
				include: [
					path.resolve(__dirname, '../src'),
					path.resolve(__dirname, '../node_modules/selfkey-ui/')
				],
				use: ['style-loader', 'css-loader']
			}
		]
	},
	plugins: [new HardSourceWebpackPlugin()],
	resolve: {
		modules: [
			path.resolve(__dirname, '..', 'src'),
			path.resolve(__dirname, '..', 'node_modules')
		],
		extensions: ['.js', '.jsx', '.css', '.svg']
	},
	// NB: Allows setting CSP without raising errors. The default setting is eval-source-map, which causes Webpack
	// to emit eval(...)'s in the renderer bundle, which makes any CSP you set unnhappy unless you allow unsafe-eval,
	// but then Electron gives you a warning. (As it should.) The tradeoff is that inline-source-map is slower.
	devtool: 'inline-source-map',
	output: {
		// NB: Can also be "window", etc.
		libraryTarget: 'window'
	},
	// NB: Target can be set to "electron-renderer", as well, but that defeats the point since electron-renderer
	// is a configuration that's intended to help augment the bundle to work with nodeIntegration: true.
	target: 'web',
	node: {
		fs: 'empty'
	}
};
