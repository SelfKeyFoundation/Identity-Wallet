import fetch from 'node-fetch';

// TODO: use selfkey domain here
const CONFIG_URL =
	'https://us-central1-kycchain-master.cloudfunctions.net/airtable?tableName=Contracts';

export class StackingService {
	constructor() {
		this.activeContract = null;
		this.deprecatedContracts = [];
	}
	parseRemoteConfig(entities) {
		return entities
			.map(entity => entity.data)
			.sort((d1, d2) => {
				d1 = d1.createdAt ? new Date(d1.createdAt).getTime() : 0;
				d2 = d2.createdAt ? new Date(d2.createdAt).getTime() : 0;
				return d1 - d2;
			})
			.reduce(
				(acc, curr) => {
					curr = { ...curr, abi: JSON.parse(curr.abi || '{}') };
					if (curr.deprecated) {
						acc.deprecatedContracts.push(curr);
						return acc;
					}
					acc.activeContract = curr;
					return acc;
				},
				{ activeContract: null, deprecatedContracts: [] }
			);
	}
	async fetchConfig() {
		try {
			let res = await fetch(CONFIG_URL);
			let data = await res.json();
			if (!data.entities) {
				throw new Error('Invalid responce');
			}
			return this.parseRemoteConfig(data.entities);
		} catch (error) {
			console.error(error);
			throw new Error('Could not fetch from airtable');
		}
	}
	async acquireContract() {
		let config = await this.fetchConfig();
		this.activeContract = config.activeContract;
		this.deprecatedContracts = config.deprecatedContracts;
	}
}

export default StackingService;
