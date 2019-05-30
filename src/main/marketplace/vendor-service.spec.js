import sinon from 'sinon';
import { VendorService, VENDOR_API_ENDPOINT } from './vendor-service';
import { Vendor } from './vendor';
import request from 'request-promise-native';
import vendorResponceFixture from './__fixtures__/vendor-airtable-response';
import vendorsFetched from './__fixtures__/vendor-fetched';
import vendorDb from './__fixtures__/vendor-db';

describe('VendorService', () => {
	let schedulerService = {};
	let vendorService;
	beforeEach(() => {
		vendorService = new VendorService({ schedulerService });
	});
	afterEach(() => {
		sinon.restore();
	});
	it('should fetch vendors', async () => {
		sinon.stub(request, 'get').resolves(vendorResponceFixture);
		const vendors = await vendorService.fetchVendors();
		expect(request.get.getCall(0).args).toEqual([
			{
				url: VENDOR_API_ENDPOINT,
				json: true
			}
		]);

		expect(vendors).toEqual(vendorsFetched);
	});
	it('should load vendors from db', async () => {
		sinon.stub(Vendor, 'findAll').resolves(vendorDb);
		const loaded = await vendorService.loadVendors();

		expect(loaded).toEqual(vendorDb);
	});
});
