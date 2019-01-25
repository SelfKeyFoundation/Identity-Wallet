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
					fix: true,
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
			},
			{
				test: /\.css$/,
				include: [
					path.resolve(__dirname, 'src'),
					path.resolve(__dirname, 'node_modules/selfkey-ui')
				],
				use: ['style-loader', 'css-loader']
			}
		]
	},
	resolve: {
		modules: [path.resolve(__dirname, '..', 'src'), 'node_modules'],
		extensions: ['.js', '.jsx', '.css']
	}
};
