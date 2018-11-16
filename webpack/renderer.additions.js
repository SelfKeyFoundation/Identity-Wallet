const path = require('path');

module.exports = {
	module: {
		rules: [
			{
				test: /\.(jsx?|tsx?|vue)$/,
				enforce: 'pre',
				exclude: /node_modules/,
				loader: 'eslint-loader',
				options: {
					cwd: path.resolve(__dirname, '..'),
					configFile: path.resolve(__dirname, '..', '.eslintrc.json')
				}
			},
			{
				test: /\.jsx?$/,
				loader: 'babel-loader',
				options: {
					presets: ['@babel/react']
				}
			}
		]
	},
	resolve: {
		modules: [path.resolve(__dirname, '..', 'src'), 'node_modules'],
		extensions: ['.js', '.jsx']
	}
};
