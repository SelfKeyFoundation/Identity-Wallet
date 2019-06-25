import config from 'common/config';
import { Vendor } from './vendor';
import request from 'request-promise-native';
import { isDevMode } from 'common/utils/common';
import _ from 'lodash';
import { VENDOR_SYNC_JOB } from './vendor-sync-job-handler';

export const VENDOR_API_ENDPOINT = `${config.airtableBaseUrl}Vendors${isDevMode() ? 'Dev' : ''}`;

export class VendorService {
	constructor({ schedulerService }) {
		this.schedulerService = schedulerService;
	}
	async fetchVendors() {
		const fetched = await request.get({ url: VENDOR_API_ENDPOINT, json: true });
		return fetched.entities.map(entity => {
			let vendor = _.mapKeys(entity.data, (value, key) => _.camelCase(key));
			if (vendor.relyingPartyConfig) {
				try {
					vendor.relyingPartyConfig = JSON.parse(vendor.relyingPartyConfig);
					if (typeof vendor.relyingPartyConfig !== 'object') {
						vendor.relyingPartyConfig = {};
					}
				} catch (error) {
					vendor.relyingPartyConfig = {};
				}
			}
			return vendor;
		});
	}
	start() {
		this.schedulerService.queueJob(null, VENDOR_SYNC_JOB);
	}
	loadVendors() {
		return Vendor.findAll();
	}
	upsert(upsert) {
		return Vendor.bulkUpsert(upsert);
	}
	deleteMany(ids) {
		return Vendor.deleteMany(ids);
	}
}

export default VendorService;
