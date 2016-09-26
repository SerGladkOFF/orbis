"use strict";

/**
 * Created by Se on 19.09.2016.
 */
var path = require('path');
var webpack = require("webpack");

module.exports = {
    entry: "./src/js/enter.js",
    output: {
        publicPath: "app/",
        filename: "main.js"
    },
    module: {
        loaders: [{ test: /\.js$/, loader: "babel" }]
    }
};

//# sourceMappingURL=webpack.config-compiled.js.map