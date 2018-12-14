'use strict';

import request from 'request';

import { Logger } from 'common/logger';

const log = new Logger('marketplace-incorporations-service');

// FIXME: hard coded URL
const URL = 'https://passports.io/api/incorporations';

export class IncorporationsService {
	loadData() {
		return new Promise((resolve, reject) => {
			log.debug('Loading incorporations API data');
			request.get({ url: URL, json: true }, (error, httpResponse, response) => {
				if (error) {
					log.error(error);
					reject(error);
				}
				resolve(response);
			});
		});
	}
}

export default IncorporationsService;
