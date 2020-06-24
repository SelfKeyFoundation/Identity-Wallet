const path = require('path');
const webpack = require('webpack');

module.exports = async ({ config }) => {
	const maxAssetSize = 1024 * 1024;
	config.devtool = 'cheap-source-map';
	config.module.rules.push({
		test: /stories\.jsx?$/,
		loaders: [require.resolve('@storybook/source-loader')],
		enforce: 'pre'
	});

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
	config.resolve.modules = [path.resolve(__dirname, '..', 'src'), 'node_modules'];
	config.resolve.extensions = ['.js', '.json', '.jsx', '.css', '.svg'];
	config.node = { fs: 'empty', net: 'mock', tls: 'mock', child_process: 'empty' };
	config.optimization = {
		splitChunks: {
			chunks: 'all',
			minSize: 30 * 1024,
			maxSize: maxAssetSize
		}
	};
	config.performance = {
		maxAssetSize: maxAssetSize
	};
	return config;
};
