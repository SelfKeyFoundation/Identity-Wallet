'use strict';

import request from 'request';
import { Logger } from 'common/logger';
import config from 'common/config';

const log = new Logger('marketplace-notaries-service');

const URL = config.notariesApiUrl;

export class NotariesService {
	loadNotaries() {
		return new Promise((resolve, reject) => {
			log.debug(`Loading notaries main API data: ${URL}`);
			request.get({ url: URL, json: true }, (error, httpResponse, response) => {
				if (error) {
					log.error(error);
					return reject(error);
				} else {
					log.debug(response);
					const payload = { response };
					resolve(payload);
				}
			});
		});
	}
}

export default NotariesService;
