const path = require('path')
const webpack = require('webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const plugins = []
if (process.env.ANALYZE) {
	plugins.push(new BundleAnalyzerPlugin({
		analyzerMode: 'server',
		openAnalyzer: true
	}))
}
else{
	plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = {
	devtool: 'eval',
	entry: [
		'./dev/dev.js'
	],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'index.js',
		publicPath: '/dev/'
	},
	plugins: plugins,
	resolve: {
		extensions: ['.js', '.jsx']
	},
	module: {
		rules: [{
			test: /\.js?$/,
			use: [{
				loader: 'babel-loader'
			}],
			include: path.join(__dirname, '/')
		}]
	}
}
