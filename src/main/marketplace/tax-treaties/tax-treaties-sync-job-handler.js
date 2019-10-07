import { Logger } from 'common/logger';
export const TAX_TREATIES_SYNC_JOB = 'tax-treaties-sync-job';

const log = new Logger(TAX_TREATIES_SYNC_JOB);
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
			acc[`${curr.countryCode}_${curr.jurisdictionCountryCode}`] = curr;
			return acc;
		}, {});

		const { dbTreatiesByCode, toRemove } = dbCountries.reduce(
			(acc, curr) => {
				let key = `${curr.countryCode}_${curr.jurisdictionCountryCode}`;
				acc.dbTreatiesByCode[key] = curr;
				if (!treaties[key]) {
					acc.toRemove.push(curr.id);
				}
				return acc;
			},
			{ dbTreatiesByCode: {}, toRemove: [] }
		);

		const upsert = remoteTreaties.map(item => {
			let key = `${item.countryCode}_${item.jurisdictionCountryCode}`;
			if (dbTreatiesByCode[key]) {
				item = { ...dbTreatiesByCode[key], ...item };
			}
			return item;
		});
		job.emitProgress(75, { message: 'Updating db data' });

		try {
			await this.taxTreatiesService.upsert(upsert);
		} catch (error) {
			log.error(error);
		}

		job.emitProgress(25, { message: 'Removing obsolete treaties' });
		await this.taxTreatiesService.deleteMany(toRemove);
		job.emitProgress(95, { message: 'Fetching updated treaty list' });

		const taxTreaties = this.taxTreatiesService.loadTaxTreaties();
		job.emitProgress(100, { message: 'Done!' });
		return taxTreaties;
	}
}

export default TaxTreatiesSyncJobHandler;
