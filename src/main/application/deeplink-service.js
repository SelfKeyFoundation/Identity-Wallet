import { Logger } from 'common/logger';
import path from 'path';
import { isDevMode } from '../../common/utils/common';
const log = new Logger('DeepLinksService');

export class DeepLinksService {
	constructor({ electron, config, walletConnectService }) {
		this.electron = electron;
		this.config = config;
		this.handlers = {
			[walletConnectService.HANDLER_NAME]: walletConnectService
		};
	}

	handlers = {
		'wallet-connect': {
			handleUrlCommand: command => {
				log.info('handling url %s', command);
			}
		}
	};

	handleOpenLink = async url => {
		try {
			log.info('incoming deep link %s', url);
			const urlRegexp = /^[^:/]*:\/\/([^/]*)\/(.*)$/;
			const match = (url || '').match(urlRegexp);
			if (!match || match.length !== 3) {
				log.info('invalid deep link format');
				return;
			}
			if (!this.handlers[match[1]]) {
				log.info('no handler for %s', match[1]);
				return;
			}

			await this.handlers[match[1]].handleUrlCommand(match[2]);
		} catch (error) {
			log.error(error);
		}
	};

	registerDeepLinks() {
		let success = false;
		try {
			if (isDevMode() && process.platform === 'win32') {
				success = this.electron.app.setAsDefaultProtocolClient(
					this.config.protocol,
					process.execPath,
					[path.resolve(process.argv[2])]
				);
			} else {
				success = this.electron.app.setAsDefaultProtocolClient(this.config.protocol);
			}
			if (!success) {
				const err = new Error('failed to registrer protocol');
				log.error(err);
				throw err;
			}

			this.electron.app.on('second-instance', (e, argv = []) => {
				e.preventDefault();
				if (!argv.length) {
					return;
				}
				if (process.platform === 'win32' || process.platform === 'linux') {
					this.handleOpenLink(argv[argv.length - 1]);
				}
			});

			this.electron.app.on('open-url', (evt, url) => {
				evt.preventDefault();
				this.handleOpenLink(url);
			});
		} catch (error) {
			log.error(error);
		}
	}
}

export default DeepLinksService;
