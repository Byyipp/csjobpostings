const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');
import 'process/browser';


module.exports = {
    plugins: [
        new Dotenv(),
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
    ],
    resolve: {
        fallback: {
            "process": require.resolve("process/browser")
        }
    }
};
