import config from 'common/config';
import Contract from './contract';
import request from 'request-promise-native';
import { isDevMode } from 'common/utils/common';
import _ from 'lodash';
import { Logger } from '../../../common/logger';
import { CONTRACTS_SYNC_JOB, CONTRACTS_SYNC_JOB_INTERVAL } from './contracts-sync-job-handler';
import { ExponentialBackoffRetryStrategy, IntervalStrategy } from '../../scheduler/strategies';

const log = new Logger('ContractsService');

export const CONTRACTS_API_ENDPOINT = `${config.airtableBaseUrl}Contracts${
	isDevMode() ? 'Dev' : ''
}`;

export class ContractService {
	constructor({ schedulerService }) {
		this.schedulerService = schedulerService;
	}
	async fetch() {
		try {
			let fetched = await request.get({ url: CONTRACTS_API_ENDPOINT, json: true });
			return fetched.entities.map(entity => {
				let item = _.mapKeys(entity.data, (value, key) => _.camelCase(key));
				try {
					item.abi = JSON.parse(item.abi);
					if (typeof item.abi !== 'object') {
						item.abi = {};
					}
				} catch (error) {
					item.abi = {};
				}

				try {
					item.config = JSON.parse(item.config);
					if (typeof item.config !== 'object') {
						item.config = {};
					}
				} catch (error) {
					item.config = {};
				}

				return item;
			});
		} catch (error) {
			log.error(error);
			throw error;
		}
	}
	start() {
		this.schedulerService.queueJob(null, CONTRACTS_SYNC_JOB, 0, null, {
			success: {
				name: IntervalStrategy.NAME,
				interval: CONTRACTS_SYNC_JOB_INTERVAL
			},
			error: {
				name: ExponentialBackoffRetryStrategy.NAME,
				attempts: 5
			}
		});
	}

	loadContracts() {
		return Contract.findAll();
	}
	upsert(upsert) {
		return Contract.bulkUpsert(upsert);
	}
	deleteMany(ids) {
		return Contract.deleteMany(ids);
	}
}
