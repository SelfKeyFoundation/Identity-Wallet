export const VENDOR_SYNC_JOB = 'vendor-sync-job';

export class VendorSyncJobHandler {
	constructor({ schedulerService }) {
		this.schedulerService = schedulerService;
		schedulerService.registerJobHandler(VENDOR_SYNC_JOB, this);
	}
}

export default VendorSyncJobHandler;
