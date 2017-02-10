let fs = require("fs-extra");

// lib下をクリア
fs.removeSync("lib");
fs.mkdirsSync("lib");

// ライブラリコピー
fs.mkdirsSync("lib/diff2html");
fs.createReadStream("node_modules/diff2html/dist/diff2html-ui.min.js")
    .pipe(fs.createWriteStream("lib/diff2html/diff2html-ui.min.js"));
fs.createReadStream("node_modules/diff2html/dist/diff2html.min.css")
    .pipe(fs.createWriteStream("lib/diff2html/diff2html.min.css"));
fs.createReadStream("node_modules/diff2html/dist/diff2html.min.js")
    .pipe(fs.createWriteStream("lib/diff2html/diff2html.min.js"));


let packager = require("electron-packager");  
let platform_arg = process.argv[2];

packager({  
    dir: "./",
    out: "./dist",
    platform: platform_arg,
    arch: "x64",
    overwrite: true,
    //asar: true,
    prune: true,
    ignore: ".DS_Store|.gitignore|node_modules|sample_text|build.js|_index.js|readme.md|webpack.config.js|yarn.lock|dist",
}, function done (err, appPath) {
    if(err) {
        throw new Error(err);
    }
    console.log('Done!!');
});
