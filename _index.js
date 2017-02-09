// jQueryモジュールを読み込む
window.$ = require("jquery");

// electronモジュールを読み込む
let electron = require("electron");
let remote = electron.remote;
let remote_app = remote.app;

// アプリを実行しているパス
let exec_app_path = remote_app.getPath("module");

// child_processモジュールの読み込み
let child_process = require("child_process");
let exec = child_process.exec;

// diff2htmlモジュールの読み込み
let diff2html = require("diff2html").Diff2Html;

$(() => {

    let $dir_left = $("#dir_left");
    let $dir_right = $("#dir_right");
    let $load = $("#load");

    // loadボタンを押下したときのイベント処理
    $load.click(() => {
        let left_path = $dir_left.prop("files")[0] ? $dir_left.prop("files")[0].path : null;
        let right_path = $dir_right.prop("files")[0] ? $dir_right.prop("files")[0].path : null;
        if (left_path && right_path) {
            execDiff(left_path, right_path);
        }
    });

    /**
     * @param left_path {string}
     * @param right_path {string}
     */
    function execDiff(left_path, right_path) {
        var command = null;
        if (process.platform == "Windows") {
            command = getWinDiffCommand(left_path, right_path);
        } else {
            command = getUnixDiffCommand(left_path, right_path);
        }
        if (command) {
            execDiffCommand(command);
        }
    }

    /**
     * @param left_path {string}
     * @param right_path {string}
     * @return command {string}
     */
    function getWinDiffCommand(left_path, right_path) {
        var command = null;
        if (exec_app_path.match("electron.exe")) {
            // 開発時の実効ファイルの設定
            let path = exec_app_path.replace(/node_modules\\electron-prebuilt\\dist\\electron.exe/g, "");
            command = path + "win_bin\\diff -ur " + left_path + " " + right_path;
        } else {
            // 本番時の実効ファイルの設定
            let path = exec_app_path.replace(/dd_wml.exe/g, "");
            command = path + "resources\\app\\win_bin\\diff -ur " + left_path + " " + right_path;
        }
        return command;
    }

    /**
     * @param left_path {string}
     * @param right_path {string}
     * @return command {string}
     */
    function getUnixDiffCommand(left_path, right_path) {
        let command = "diff -ur " + left_path + " " + right_path;
        return command;
    }

    /**
     * @param command {string}
     */
    function execDiffCommand(command) {
        exec(command, (error, stdout, stderr) => {
            if(stdout) {
                var diff_json = diff2html.getJsonFromDiff(stdout);
                var diff2htmlUi = new Diff2HtmlUI({json: diff_json});
                diff2htmlUi.draw('#diff_area', {
                    inputFormat: "json",
                    outputFormat: "side-by-side",
                    showFiles: true,
                    matching: "lines"
                });
                console.log("stdout: " + stdout);
            }
            if(stderr){
                // alert("stderr: " + stderr)
                console.log("stderr: " + stderr);
            }
            if (error !== null) {
                // alert("Exec error: " + error);
                console.log("Exec error: " + error);
            }
        });
    }
});
