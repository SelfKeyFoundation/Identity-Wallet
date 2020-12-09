import { Logger } from 'common/logger';
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
			// selfkey://wc?uri=wc:b18792a6-2b02-4479-83ab-d8dd4d2ef9c6@1?bridge=https%3A%2F%2Fbridge.walletconnect.org&key=c28407a557a89e96be04a0fc44f1ad9a1c4c180d46af6ec27dfb03d917674089
			log.info('incoming deep link %s', url);
			if (url.indexOf('selfkey://wc?uri=') === 0) {
				const uri = url.replace('selfkey://wc?uri=', '');
				await this.handlers['wallet-connect'].handleUrlCommand(uri);
			} else {
				log.info('invalid deep link format');
				return;
			}
			/*
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
			*/
		} catch (error) {
			log.error(error);
		}
	};

	registerDeepLinks() {
		const success = this.electron.app.setAsDefaultProtocolClient(this.config.protocol);

		if (!success) {
			const err = new Error('failed to registrer protocol');
			log.error(err);
			throw err;
		}

		this.electron.app.on('open-url', (evt, url) => {
			evt.preventDefault();
			this.handleOpenLink(url);
		});
	}
}

export default DeepLinksService;
