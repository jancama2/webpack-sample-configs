const fs = require('fs');
const path = require('path');

const webpack = require('webpack');
const merge = require('webpack-merge');
const Extract = require('extract-text-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const Liverload = require('webpack-livereload-plugin');

const packages = require('../../package.json');

const enviroment = process.env.NODE_ENV;

const PATHS = {
    app: path.join(__dirname, 'src'),
    build: path.join(__dirname, 'build')
};

const FILENAMES = {
    build: '[name].js',
    vendor: 'vendors.js',
    sass: 'sass.build.css',
    html: 'index.html',
};

const FILES = {};
fs.readdirSync(PATHS.app).forEach((file) => {
    const match = file.match(/(.*)\.(js|jsx)$/);
    if (match) {
        FILES[match[1]] = `./${file}`;
    }
});

console.log(`Building Webpack project with enviroment "${enviroment}"`);

let config = {
    context: PATHS.app,
    entry: FILES,
    output: {
        path: PATHS.build,
        filename: FILENAMES.build,
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
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
                test: /\.css$/,
                exclude: /main.css/,
                use: [
                    {
                        loader: 'style-loader',
                    },{
                        loader: 'css-loader',
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
            {
                test: /\.png$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'images/[name].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new Extract({
            filename: FILENAMES.sass,
        }),
        new webpack.EnvironmentPlugin([
            'NODE_ENV',
        ]),
    ]
};

let envConfig = {};

const commonConfig = {
    entry: {
        vendor: Object.keys(packages.dependencies),
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: FILENAMES.vendor
        }),
    ]
};

if (enviroment === 'production') {
    envConfig.plugins = [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
        })
    ];
    envConfig.devtool = 'source-map';
} else {
    envConfig.plugins = [
        new HtmlPlugin({
            filename: FILENAMES.html
        }),
        new Liverload()
    ];
    envConfig.devServer = {
        contentBase: path.join(__dirname),
        port: 8080
    };
    envConfig.devtool = 'eval';
}

module.exports = merge(config, commonConfig, envConfig);
