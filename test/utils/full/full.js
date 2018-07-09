const chalk = require('chalk');
const exec = require('child_process').exec;
const config = require('../../config/config.js');

function fullClip() {
	exec(config.fullCmd, err => {
		if (err) {
			return console.log(chalk.red('Full Clip Failed With Error: '), err);
		} else {
			return console.log(chalk.green('Full Clip Success'));
		}
	});
}

fullClip();
