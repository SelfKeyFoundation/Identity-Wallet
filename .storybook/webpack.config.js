const path = require('path');
const webpack = require('webpack');

module.exports = async ({ config }) => {
	config.module.rules.push({
		test: /\.jsx?$/,
		loader: 'babel-loader',
		include: [
			path.resolve(__dirname, '../src'),
			path.resolve(__dirname, '../node_modules/selfkey-ui/')
		],
		options: {
			presets: [
				[
					'@babel/preset-env',
					{
						targets: {
							node: 'current'
						}
					}
				],
				'@babel/preset-react'
			],
			plugins: [
				'@babel/plugin-proposal-class-properties',
				'@babel/plugin-syntax-dynamic-import'
			]
		}
	});

	config.plugins.push(
		new webpack.EnvironmentPlugin({
			STORYBOOK: '1'
		})
	);

	config.resolve.modules = [
		path.resolve(__dirname, '..', 'src'),
		path.resolve(__dirname, '..', 'node_modules')
	];

	config.resolve.extensions = ['.js', '.jsx', '.css', '.svg'];
	config.node = { fs: 'empty', net: 'mock', tls: 'mock', child_process: 'empty' };
	return config;
};
