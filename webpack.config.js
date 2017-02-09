var webpack = require("webpack");
var path = require('path');

module.exports = {
    entry: {
        index:  path.join(__dirname, "/_index.js")
    },
    output: {
        path: "./",
        filename: "[name].js"
    },
    target: "atom",
    externals: [
        (function () {
            var IGNORES = [
                "electron",
                "child_process"
            ];
            return function (context, request, callback) {
                if (IGNORES.indexOf(request) >= 0) {
                    return callback(null, "require('" + request + "')");
                }
                return callback();
            };
        })()
    ]
};