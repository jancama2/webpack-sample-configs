const webpack = require('webpack');
const path = require('path');
const Extract = require('extract-text-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname),
    entry: './index.js',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'index.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['latest', 'react']
                        }
                    }
                ]
            },
            {
                test: /\.sass$/,
                loader: Extract.extract({
                    fallback: 'style-loader',
                    use: 'css-loader!sass-loader'
                })
            },
        ]
    },
    plugins: [
        new Extract({
            filename: 'bundled-sass.css',
        }),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
        }),
        new webpack.EnvironmentPlugin([
            'NODE_ENV',
        ]),
    ]
}
;
