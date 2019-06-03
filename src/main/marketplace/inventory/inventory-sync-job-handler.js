export const INVENTORY_SYNC_JOB = 'inventory-sync-job';

export class InventorySyncJobHandler {
	constructor({ schedulerService, inventoryService }) {
		this.schedulerService = schedulerService;
		this.inventoryService = inventoryService;
	}

	registerHandler() {
		this.schedulerService.registerJobHandler(INVENTORY_SYNC_JOB, this);
	}

	async execute(data, job) {
		job.emitProgress(0, { message: 'starting sync' });

		job.emitProgress(0, { message: 'fetching remote inventory' });
		const remoteInventory = await this.inventoryService.fetchInventory(data.fetcherName);
		job.emitProgress(25, { message: 'remote inventory fetched' });

		job.emitProgress(25, { message: 'load db inventory' });
		const dbInventory = await this.inventoryService.loadInventory();
		job.emitProgress(50, { message: 'load db inventory' });

		job.emitProgress(50, { message: 'Merging remote and local data' });

		let inventoryBySKU = remoteInventory.reduce((acc, curr) => {
			acc[curr.sku] = curr;
			return acc;
		}, {});

		const { dbInventoryBySKU, toRemove } = dbInventory.reduce(
			(acc, curr) => {
				acc.dbInventoryBySKU[curr.sku] = curr;
				if (!inventoryBySKU[curr.sku]) {
					acc.toRemove.push(curr.id);
				}
				return acc;
			},
			{ dbInventoryBySKU: {}, toRemove: [] }
		);

		const upsert = remoteInventory.map(item => {
			if (dbInventoryBySKU[item.sku]) {
				item = { ...dbInventoryBySKU[item.sku], ...item };
			}
			return item;
		});
		job.emitProgress(75, { message: 'Updating db data' });
		await this.inventoryService.upsert(upsert);
		job.emitProgress(25, { message: 'Removing obsolete inventory' });
		await this.inventoryService.deleteMany(toRemove);
		job.emitProgress(95, { message: 'Fetching updated inventory list' });
		const inventory = this.inventoryService.loadInventory();
		job.emitProgress(100, { message: 'Done!' });
		return inventory;
	}
}

export default InventorySyncJobHandler;
