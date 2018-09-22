import fetch from 'node-fetch';

// import CONFIG from 'common/config';
import { abi as SELFKEY_ABI } from 'main/assets/data/abi.json';
// import { TxHistory } from './tx-history';

// TODO: use selfkey domain here
const CONFIG_URL =
	'https://us-central1-kycchain-master.cloudfunctions.net/airtable?tableName=Contracts';

// TODO: refactor away to config
const SELFKEY_TOKEN_ADDRESS = '0xcfec6722f119240b97effd5afe04c8a97caa02ee'; // prod: '0x4cc19356f2d37338b9802aa8e8fc58b0373296e7';

export class StakingService {
	constructor({ web3Service }) {
		this.activeContract = null;
		this.deprecatedContracts = [];
		this.web3 = web3Service;
		this.tokenContract = new SelfKeyTokenContract(
			this.web3,
			SELFKEY_TOKEN_ADDRESS,
			SELFKEY_ABI
		);
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
		let { activeContract, deprecatedContracts } = await this.fetchConfig();
		this.activeContract = new StakingContract(
			this.web3,
			activeContract.address,
			activeContract.abi,
			!!activeContract.deprecated
		);
		this.deprecatedContracts = deprecatedContracts.map(
			contract =>
				new StakingContract(
					this.web3,
					contract.address,
					contract.abi,
					!!contract.deprecated
				)
		);
	}
}

export class EtheriumContract {
	constructor(web3, address, abi) {
		this.web3 = web3;
		this.address = address;
		this.abi = abi;
	}

	async send(options) {
		let hash = await this.web3.waitForTicket({
			method: 'send',
			contractMethodArgs: options.args || [],
			contractAddress: this.address,
			contractMethod: options.method,
			customAbi: this.abi,
			onceListenerName: 'transactionHash',
			args: [{ from: options.from }]
		});
		return hash;
		// console.log(hash);
		// return TxHistory.addOrUpdate({
		// 	hash,
		// 	from: options.from,
		// 	to: this.address,
		// 	contractAddress: this.address,
		// 	value: 0,
		// 	gasPrice: 0,
		// 	networkId: CONFIG.chainId,
		// 	timeStamp: Date.now()
		// });
	}

	call(options) {
		return this.web3.waitForTicket({
			method: 'call',
			contractMethodArgs: options.args || [],
			contractAddress: this.address,
			contractMethod: options.method,
			customAbi: this.abi,
			args: [{ from: options.from }]
		});
	}
}

export class StakingContract extends EtheriumContract {
	constructor(web3, address, abi, isDeprecated) {
		super(web3, address, abi);
		this.isDeprecated = isDeprecated;
	}

	getBalance(sourceAddress, serviceAddress, serviceId) {
		return this.call({
			from: sourceAddress,
			args: [sourceAddress, serviceAddress, serviceId],
			method: 'balances'
		});
	}

	deposit(sourceAddress, ammount, serviceAddress, serviceId) {
		return this.send({
			from: sourceAddress,
			args: [ammount, serviceAddress, serviceId],
			method: 'deposit'
		});
	}

	withdraw(sourceAddress, serviceAddress, serviceId) {
		return this.send({
			from: sourceAddress,
			args: [serviceAddress, serviceId],
			method: 'withdraw'
		});
	}

	getReleaseDate(sourceAddress, serviceAddress, serviceId) {
		return this.call({
			from: sourceAddress,
			args: [sourceAddress, serviceAddress, serviceId],
			method: 'releaseDates'
		});
	}

	getLockPeriod(sourceAddress, serviceAddress, serviceId) {
		return this.call({
			from: sourceAddress,
			args: [serviceAddress, serviceId],
			method: 'lockPeriods'
		});
	}
}

export class SelfKeyTokenContract extends EtheriumContract {
	approve(sourceAddress, depositVaultAddress, maxAmmount) {
		return this.send({
			from: sourceAddress,
			args: [depositVaultAddress, maxAmmount],
			method: 'approve'
		});
	}
}

export default StakingService;
