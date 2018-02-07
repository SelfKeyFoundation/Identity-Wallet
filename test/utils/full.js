const chalk = require("chalk");
const exec = require("child_process").exec;
const pwd = process.cwd();
const APP_TITLE = require("../../package.json").config.forge
  .electronPackagerConfig.name;
const user = require("os").userInfo().username;

function fullClip() {
  const command =
    "bash " +
    pwd +
    "/test/utils/full.sh " +
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
