export const CONTRACTS_SYNC_JOB = 'contracts-sync-job';
export const CONTRACTS_SYNC_JOB_INTERVAL = 10 * 60 * 60 * 1000;

export class ContractSyncJobHandler {
	constructor({ schedulerService, contractService }) {
		this.schedulerService = schedulerService;
		this.contractService = contractService;
	}

	registerHandler() {
		this.schedulerService.registerJobHandler(CONTRACTS_SYNC_JOB, this);
	}

	async execute(data, job) {
		job.emitProgress(0, { message: 'starting sync' });

		job.emitProgress(0, { message: 'fetching remote contracts' });
		const remote = await this.contractService.fetch(data);
		job.emitProgress(25, { message: 'remote contracts fetched' });

		job.emitProgress(25, { message: 'load db contracts' });
		const local = await this.contractService.loadContracts();
		job.emitProgress(50, { message: 'Merging remote and local data' });

		let contractByAddress = remote.reduce((acc, curr) => {
			acc[curr.address] = curr;
			return acc;
		}, {});

		const { localContractsByAddress, toRemove } = local.reduce(
			(acc, curr) => {
				acc.localContractsByAddress[curr.address] = curr;
				if (!contractByAddress[curr.address]) {
					acc.toRemove.push(curr.id);
				}
				return acc;
			},
			{ localContractsByAddress: {}, toRemove: [] }
		);

		const upsert = remote.map(item => {
			if (localContractsByAddress[item.address]) {
				item = { ...localContractsByAddress[item.address], ...item };
			}
			return item;
		});
		job.emitProgress(75, { message: 'Updating db data' });
		await this.contractService.upsert(upsert);
		job.emitProgress(25, { message: 'Removing obsolete contracts' });
		await this.contractService.deleteMany(toRemove);
		job.emitProgress(95, { message: 'Fetching updated contract list' });
		const contract = await this.contractService.loadContracts();
		job.emitProgress(100, { message: 'Done!' });
		return contract;
	}
}

export default ContractSyncJobHandler;
