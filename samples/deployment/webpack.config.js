const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const Extract = require('extract-text-webpack-plugin');

const enviroment = process.env.NODE_ENV;

const PATHS = {
    app: path.join(__dirname, 'src'),
    build: path.join(__dirname, 'build')
};

const FILENAMES = {
    build: '[name].js',
    sass: 'sass.build.css'
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
            filename: FILENAMES.sass,
        }),
        new webpack.EnvironmentPlugin([
            'NODE_ENV',
        ]),
    ]
};

let envConfig = {};

if (enviroment === 'production') {
    envConfig.plugins = [
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
        })
    ];
    envConfig.devtool = 'source-map';
} else {
    envConfig.devtool = 'eval';
}

module.exports = merge(config, envConfig);
