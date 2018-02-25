const chalk = require("chalk");
exec = require("child_process").exec;
pwd = process.cwd();
APP_TITLE = require("../../package.json").config.forge.electronPackagerConfig
    .name;
user = require("os").userInfo().username;

function fullClip() {
    const command =
        "bash " +
        pwd +
        "/test/utils/full/full.sh " +
        user +
        " " +
        APP_TITLE +
        " " +
        pwd.replace("/test/utils/", "");
    exec(command, err => {
        if (err) {
            return console.log(chalk.red("Full Clip Failed With Error: "), err);
        } else {
            return console.log(chalk.green("Full Clip Success"));
        }
    });
}

fullClip();
