export const TAX_TREATIES_SYNC_JOB = 'tax-treaties-sync-job';

export class TaxTreatiesSyncJobHandler {
	constructor({ schedulerService, taxTreatiesService }) {
		this.schedulerService = schedulerService;
		this.taxTreatiesService = taxTreatiesService;
	}

	registerHandler() {
		this.schedulerService.registerJobHandler(TAX_TREATIES_SYNC_JOB, this);
	}

	async execute(data, job) {
		job.emitProgress(0, { message: 'starting sync' });

		job.emitProgress(0, { message: 'fetching remote treaty' });
		const remoteTreaties = await this.taxTreatiesService.fetchTaxTreaties();
		job.emitProgress(25, { message: 'remote treaty fetched' });

		job.emitProgress(25, { message: 'load db treaty' });
		const dbCountries = await this.taxTreatiesService.loadTaxTreaties();
		job.emitProgress(50, { message: 'load db treaty' });

		job.emitProgress(50, { message: 'Merging remote and local data' });

		let treaties = remoteTreaties.reduce((acc, curr) => {
			acc[curr.countryCode] = curr;
			return acc;
		}, {});

		const { dbTreatiesByCode, toRemove } = dbCountries.reduce(
			(acc, curr) => {
				acc.dbCountriesByCode[curr.code] = curr;
				if (!treaties[curr.code]) {
					acc.toRemove.push(curr.id);
				}
				return acc;
			},
			{ dbCountriesByCode: {}, toRemove: [] }
		);
		const upsert = remoteTreaties.map(item => {
			if (dbTreatiesByCode[item.code]) {
				item = { ...dbTreatiesByCode[item.code], ...item };
			}
			return item;
		});
		job.emitProgress(75, { message: 'Updating db data' });
		await this.taxTreatiesService.upsert(upsert);
		job.emitProgress(25, { message: 'Removing obsolete treaties' });
		await this.taxTreatiesService.deleteMany(toRemove);
		job.emitProgress(95, { message: 'Fetching updated treaty list' });
		const inventory = this.taxTreatiesService.loadCountries();
		job.emitProgress(100, { message: 'Done!' });
		return inventory;
	}
}

export default TaxTreatiesSyncJobHandler;
