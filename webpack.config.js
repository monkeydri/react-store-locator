const path = require('path')
const webpack = require('webpack')

module.exports = {
	devtool: 'eval',
	entry: [
		'./dev/index'
	],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'index.js',
		publicPath: '/'
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin()
	],
	resolve: {
		extensions: ['.js', '.jsx']
	},
	module: {
		rules: [{
			test: /\.js?$/,
			use: [{
				loader: 'babel-loader'
			}],
			include: path.join(__dirname, 'dev')
		}]
	}
}
