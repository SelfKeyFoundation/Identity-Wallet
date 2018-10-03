/* istanbul ignore file */
'use strict';
import electron, { app, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import ChildProcess from 'child_process';
import { Logger } from '../common/logger';
import striptags from 'striptags';

const log = new Logger('autoupdater');

export function appUpdater() {
	autoUpdater.logger = log;

	// TODO: hard coding it now but should be moved to a config file or build time or allow user to choose
	autoUpdater.channel = 'beta';
	autoUpdater.allowDowngrade = false;

	// Ask the user if update is available
	autoUpdater.on('update-downloaded', info => {
		let message =
			app.getName() +
			' ' +
			info.releaseName +
			' is now available. It will be installed the next time you restart the application.';
		if (info.releaseNotes) {
			const notesInText = striptags(info.releaseNotes);
			const splitNotes = notesInText.split(/[^\r]\n/);
			message += '\n\nRelease Notes:\n';
			splitNotes.forEach(notes => {
				message += notes + '\n\n';
			});
		}
		// Ask user to update the app
		dialog.showMessageBox(
			{
				type: 'question',
				buttons: ['Install and Relaunch', 'Later'],
				defaultId: 0,
				message: 'A new version of ' + app.getName() + ' has been downloaded',
				detail: message
			},
			response => {
				if (response === 0) {
					setTimeout(() => autoUpdater.quitAndInstall(), 1);
				}
			}
		);
	});
	// init for updates
	autoUpdater.checkForUpdatesAndNotify();
}

export function handleSquirrelEvent() {
	log.info('started handleSquirrelEvent');

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
	log.info('end handleSquirrelEvent');
}

export default appUpdater;
