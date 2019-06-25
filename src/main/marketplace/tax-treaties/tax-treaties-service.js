import config from 'common/config';
import { TaxTreaties } from './tax-treaties';
import request from 'request-promise-native';
import { isDevMode } from 'common/utils/common';
import _ from 'lodash';
import { Logger } from '../../../common/logger';
import { TAX_TREATIES_SYNC_JOB } from './tax-treaties-sync-job-handler';
const log = new Logger('TaxTreatiesService');

export const FLAGTHEORY_TAX_TREATIES_ENDPOINT = config.incorporationTreatiesUrl;

export const TAX_TREATIES_API_ENDPOINT = `${config.airtableBaseUrl}TaxTreaties${
	isDevMode() ? 'Dev' : ''
}`;

export class TaxTreatiesService {
	constructor({ schedulerService }) {
		this.schedulerService = schedulerService;
	}
	async fetchTaxTreaties() {
		const [sk, ft] = await Promise.all([
			this.fetchTaxTreatiesSelfkey(),
			this.fetchTaxTreatiesFlagtheory()
		]);

		let map = sk.reduce((acc, curr) => {
			let key = `${curr.countryCode}_${curr.jurisdictionCountryCode}`;
			acc[key] = curr;
			return acc;
		}, {});

		let treaties = ft.map(t => {
			let key = `${t.countryCode}_${t.jurisdictionCountryCode}`;
			let treaty = map[key];
			if (!treaty) {
				return t;
			}
			delete map[key];
			return { ...t, ...treaty };
		});
		treaties = Object.keys(map).reduce((acc, key) => {
			acc.push(map[key]);
			return acc;
		}, treaties);
		return treaties;
	}
	async fetchTaxTreatiesSelfkey() {
		try {
			let fetched = await request.get({ url: TAX_TREATIES_API_ENDPOINT, json: true });
			return fetched.entities.map(entity =>
				_.mapKeys(entity.data, (value, key) => _.camelCase(key))
			);
		} catch (error) {
			log.error(error);
			return [];
		}
	}
	async fetchTaxTreatiesFlagtheory() {
		try {
			let fetched = await request.get({ url: FLAGTHEORY_TAX_TREATIES_ENDPOINT, json: true });
			return fetched[0].map(entity =>
				_.mapKeys(_.omit(entity, 'id'), (value, key) => _.camelCase(key))
			);
		} catch (error) {
			log.error(error);
			return [];
		}
	}
	start() {
		this.schedulerService.queueJob(null, TAX_TREATIES_SYNC_JOB);
	}

	loadTaxTreaties() {
		return TaxTreaties.findAll();
	}
	upsert(upsert) {
		return TaxTreaties.bulkUpsert(upsert);
	}
	deleteMany(ids) {
		return TaxTreaties.deleteMany(ids);
	}
}

export default TaxTreatiesService;
