const path = require('path');

module.exports = async ({ config }) => {
	config.module.rules.push({
		test: /\.jsx?$/,
		loader: 'babel-loader',
		include: [
			path.resolve(__dirname, '../src'),
			path.resolve(__dirname, '../node_modules/selfkey-ui/')
		],
		options: {
			presets: ['@babel/react']
		}
	});

	config.resolve.modules = [
		path.resolve(__dirname, '..', 'src'),
		path.resolve(__dirname, '..', 'node_modules')
	];

	config.resolve.extensions = ['.js', '.jsx', '.css', '.svg'];
	return config;
};
