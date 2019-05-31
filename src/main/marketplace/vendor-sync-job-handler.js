export const VENDOR_SYNC_JOB = 'vendor-sync-job';

export class VendorSyncJobHandler {
	constructor({ schedulerService, vendorService }) {
		this.schedulerService = schedulerService;
		this.vendorService = vendorService;
	}

	registerHandler() {
		this.schedulerService.registerJobHandler(VENDOR_SYNC_JOB, this);
	}

	async execute(data, job) {
		job.emitProgress(0, { message: 'starting sync' });

		job.emitProgress(0, { message: 'fetching remote vendors' });
		const remoteVendors = await this.vendorService.fetchVendors();
		job.emitProgress(25, { message: 'remote vendors fetched' });

		job.emitProgress(25, { message: 'load db vendors' });
		const dbVendors = await this.vendorService.loadVendors();
		job.emitProgress(50, { message: 'load db vendors' });

		job.emitProgress(50, { message: 'Merging remote and local data' });

		let vendorsById = remoteVendors.reduce((acc, curr) => {
			acc[curr.vendorId] = curr;
			return acc;
		}, {});

		const { dbVendorsById, toRemove } = dbVendors.reduce(
			(acc, curr) => {
				acc.dbVendorsById[curr.vendorId] = curr;
				if (!vendorsById[curr.vendorId]) {
					acc.toRemove.push(curr.id);
				}
				return acc;
			},
			{ dbVendorsById: {}, toRemove: [] }
		);

		const upsert = remoteVendors.map(vendor => {
			if (dbVendorsById[vendor.vendorId]) {
				vendor = { ...dbVendorsById[vendor.vendorId], ...vendor };
			}
			return vendor;
		});
		job.emitProgress(75, { message: 'Updating db data' });
		await this.vendorService.upsert(upsert);
		job.emitProgress(25, { message: 'Removing obsolete vendors' });
		await this.vendorService.deleteMany(toRemove);
		job.emitProgress(95, { message: 'Fetching updated vendors list' });
		return this.vendorService.loadVendors();
	}
}

export default VendorSyncJobHandler;
