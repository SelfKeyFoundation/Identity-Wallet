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
	plugins: [
		new HardSourceWebpackPlugin()
		// new HardSourceWebpackPlugin.ExcludeModulePlugin([
		// 	{
		// 		// HardSource works with mini-css-extract-plugin but due to how
		// 		// mini-css emits assets, assets are not emitted on repeated builds with
		// 		// mini-css and hard-source together. Ignoring the mini-css loader
		// 		// modules, but not the other css loader modules, excludes the modules
		// 		// that mini-css needs rebuilt to output assets every time.
		// 		test: /mini-css-extract-plugin[\\/]dist[\\/]loader/
		// 	}
		// ])
	],
	resolve: {
		modules: [
			path.resolve(__dirname, '..', 'src'),
			path.resolve(__dirname, '..', 'node_modules')
		],
		extensions: ['.js', '.jsx', '.css', '.svg']
	}
};
