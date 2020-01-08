/* istanbul ignore file */
'use strict';
import electron from 'electron';
import path from 'path';
import ChildProcess from 'child_process';
import { Logger } from '../common/logger';

const log = new Logger('squirrelEvent');

export function handleSquirrelEvent() {
	log.debug('started handleSquirrelEvent');

	if (process.argv.length === 1) {
		return false;
	}

	const appFolder = path.resolve(process.execPath, '..');
	const rootAtomFolder = path.resolve(appFolder, '..');
	const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
	const exeName = 'Identity-Wallet-Installer.exe';

	const spawn = function(command, args) {
		let spawnedProcess;

		try {
			spawnedProcess = ChildProcess.spawn(command, args, { detached: true });
		} catch (error) {
			log.error(error);
		}

		return spawnedProcess;
	};

	const spawnUpdate = function(args) {
		return spawn(updateDotExe, args);
	};

	const squirrelEvent = process.argv[1];
	switch (squirrelEvent) {
		case '--squirrel-install':
		case '--squirrel-updated':
			// Optionally do things such as:
			// - Add your .exe to the PATH
			// - Write to the registry for things like file associations and
			//   explorer context menus

			// Install desktop and start menu shortcuts
			spawnUpdate(['--createShortcut', exeName]);

			setTimeout(electron.app.quit, 1000);
			return true;

		case '--squirrel-uninstall':
			// Undo anything you did in the --squirrel-install and
			// --squirrel-updated handlers

			// Remove desktop and start menu shortcuts
			spawnUpdate(['--removeShortcut', exeName]);

			setTimeout(electron.app.quit, 1000);
			return true;

		case '--squirrel-obsolete':
			// This is called on the outgoing version of your app before
			// we update to the new version - it's the opposite of
			// --squirrel-updated

			electron.app.quit();
			return true;
	}
	log.debug('end handleSquirrelEvent');
}

export default handleSquirrelEvent;
