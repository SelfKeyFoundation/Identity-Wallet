import config from 'common/config';
import { Vendor } from './vendor';
import request from 'request-promise-native';
import { isDevMode } from 'common/utils/common';
import _ from 'lodash';

export const VENDOR_API_ENDPOINT = `${config.airtableBaseUrl}Vendors${isDevMode() ? 'Dev' : ''}`;

export class VendorService {
	async fetchVendors() {
		const fetched = await request.get({ url: VENDOR_API_ENDPOINT, json: true });
		return fetched.entities.map(entity =>
			_.mapKeys(entity.data, (value, key) => _.camelCase(key))
		);
	}
	loadVendors() {
		return Vendor.findAll();
	}
}

export default VendorService;
