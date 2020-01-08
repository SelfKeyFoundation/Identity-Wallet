import { autoUpdater } from 'electron-updater';
import { Logger } from 'common/logger';
import { EventEmitter } from 'events';

const log = new Logger('autoupdater');

export class AutoUpdateService extends EventEmitter {
	constructor({ app }) {
		super();
		this.app = app;
		autoUpdater.logger = log;
		autoUpdater.channel = 'beta';
		autoUpdater.allowDowngrade = false;
		autoUpdater.autoDownload = false;

		autoUpdater.on('update-available', info => this.emit('update-available', info));
		autoUpdater.on('download-progress', progress => this.emit('download-progress', progress));
		autoUpdater.on('update-downloaded', info => this.emit('update-downloaded', info));
	}

	checkForUpdatesAndNotify() {
		autoUpdater.checkForUpdatesAndNotify();
	}

	downloadUpdate() {
		autoUpdater.downloadUpdate();
	}

	quitAndInstall() {
		autoUpdater.quitAndInstall();
	}
}

export default AutoUpdateService;
