export const LISTING_EXCHANGES_SYNC_JOB = 'vendor-sync-job';

export class ListingExchangesSyncJobHandler {
	constructor({ schedulerService, exchangesService }) {
		this.schedulerService = schedulerService;
		this.exchangesService = exchangesService;
	}

	registerHandler() {
		this.schedulerService.registerJobHandler(LISTING_EXCHANGES_SYNC_JOB, this);
	}

	async execute(data, job) {
		const listingExchanges = await this.exchangesService.syncListingExchanges();
		return listingExchanges;
	}
}

export default ListingExchangesSyncJobHandler;
