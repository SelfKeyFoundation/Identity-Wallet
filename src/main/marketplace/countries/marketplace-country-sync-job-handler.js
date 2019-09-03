export const MARKETPLACE_COUNTRY_SYNC_JOB = 'marketplace-country-sync-job';

export class MarketplaceCountrySyncJobHandler {
	constructor({ schedulerService, marketplaceCountryService }) {
		this.schedulerService = schedulerService;
		this.marketplaceCountryService = marketplaceCountryService;
	}

	registerHandler() {
		this.schedulerService.registerJobHandler(MARKETPLACE_COUNTRY_SYNC_JOB, this);
	}

	async execute(data, job) {
		job.emitProgress(0, { message: 'starting sync' });

		job.emitProgress(0, { message: 'fetching remote countries' });
		const remoteCountries = await this.marketplaceCountryService.fetchMarketplaceCountries();
		job.emitProgress(25, { message: 'remote countries fetched' });
		job.emitProgress(25, { message: 'load db countries' });
		const dbCountries = await this.marketplaceCountryService.loadCountries();
		job.emitProgress(50, { message: 'load db countries complete' });
		job.emitProgress(50, { message: 'Merging remote and local data' });

		let countriesByCode = remoteCountries.reduce((acc, curr) => {
			acc[curr.code] = curr;
			return acc;
		}, {});

		const { dbCountriesByCode, toRemove } = dbCountries.reduce(
			(acc, curr) => {
				acc.dbCountriesByCode[curr.code] = curr;
				if (!countriesByCode[curr.code]) {
					acc.toRemove.push(curr.id);
				}
				return acc;
			},
			{ dbCountriesByCode: {}, toRemove: [] }
		);

		const upsert = remoteCountries.map(item => {
			if (dbCountriesByCode[item.code]) {
				item = { ...dbCountriesByCode[item.code], ...item };
			}
			return item;
		});
		job.emitProgress(75, { message: 'Updating db data' });
		await this.marketplaceCountryService.upsert(upsert);
		job.emitProgress(25, { message: 'Removing obsolete countries' });
		await this.marketplaceCountryService.deleteMany(toRemove);
		job.emitProgress(95, { message: 'Fetching updated country list' });
		const inventory = this.marketplaceCountryService.loadCountries();
		job.emitProgress(100, { message: 'Done!' });
		return inventory;
	}
}

export default MarketplaceCountrySyncJobHandler;
