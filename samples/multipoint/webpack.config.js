const path = require('path');

module.exports = {
    context: path.resolve(__dirname),
    entry: {
        'index': './index.js',
        'login': './login.js'
    },
    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].js',
        // filename: '[hash].js',
        // filename: '[chunkhash].js',
    }
};
