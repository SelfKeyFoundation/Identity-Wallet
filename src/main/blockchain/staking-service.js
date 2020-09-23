import fetch from 'node-fetch';
import CONFIG from 'common/config';
import { abi as SELFKEY_ABI } from 'main/assets/data/abi.json';
import { Token } from '../token/token';
import BN from 'bignumber.js';
import { Logger } from 'common/logger';

const log = new Logger('staking-service');

// TODO: use selfkey domain here
const AIRTABLE_NAME = CONFIG.chainId === 1 ? 'Contracts' : 'ContractsTest';
const airtableBaseUrl = CONFIG.airtableBaseUrl;

const CONFIG_URL = `${airtableBaseUrl}${AIRTABLE_NAME}`;

export class StakingService {
	constructor({ web3Service }) {
		this.activeContract = null;
		this.deprecatedContracts = [];
		this.web3 = web3Service;
	}
	async getStakingInfo(serviceAddress, serviceId, options) {
		let info = { balance: 0, serviceAddress, serviceId, contract: null, releaseDate: 0 };
		let contracts = [this.activeContract].concat(this.deprecatedContracts);
		let balance = 0;
		options = { ...options };
		for (let i = 0; i < contracts.length; i++) {
			try {
				balance = await contracts[i].getBalance(serviceAddress, serviceId, options);
			} catch (error) {
				log.error('balance error %s, %2j', error, info);
				balance = 0;
			}
			if (!balance) continue;
			info.balance = balance;
			info.contract = contracts[i];
			if (!contracts[i].isDeprecated) {
				info.releaseDate = await contracts[i].getReleaseDate(
					serviceAddress,
					serviceId,
					options
				);
			}
			return info;
		}
		return info;
	}
	async placeStake(amount, serviceAddress, serviceId, options) {
		let hashes = {};
		options = { ...options };
		let totalGas = options.gas;
		let approveGas, depositGas;
		let allowance = new BN(
			await this.tokenContract.allowance(this.activeContract.address, {
				from: options.from
			})
		);
		let hasAllowance = allowance.gte(new BN(amount));
		if (!hasAllowance && totalGas) {
			approveGas = (
				(await this.tokenContract.approve(this.activeContract.address, amount, {
					from: options.from,
					method: 'estimateGas',
					value: '0x00'
				})) || {}
			).gas;
			depositGas = totalGas - approveGas;
		}
		if (!hasAllowance) {
			hashes.approve = await this.tokenContract.approve(this.activeContract.address, amount, {
				...options,
				gas: approveGas
			});
		}
		hashes.deposit = await this.activeContract.deposit(amount, serviceAddress, serviceId, {
			...options,
			gas: depositGas
		});
		return hashes;
	}
	async withdrawStake(serviceAddress, serviceId, options) {
		log.debug('withdrawing stake for %s, %s, %2j', serviceAddress, serviceId, options);
		serviceId = this.web3.ensureStrHex(serviceId);
		let info = await this.getStakingInfo(serviceAddress, serviceId, options);
		if (!info.contract) throw new Error('no contract to withdraw from');
		if (!info.contract.isDeprecated && Date.now() < info.releaseDate)
			throw new Error('stake is locked');
		return info.contract.withdraw(serviceAddress, serviceId, options);
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
		let token = await Token.findOneBySymbol(CONFIG.constants.primaryToken.toUpperCase());
		this.tokenContract = new SelfKeyTokenContract(this.web3, token);
	}
}

export class EtheriumContract {
	constructor(web3, address, abi) {
		this.web3 = web3;
		this.address = address;
		this.abi = abi;
	}

	async send(options) {
		const { args } = options;
		const contractMethod = options.method;
		const opt = options.options;
		const method = opt.method || 'send';
		const onceListenerName = method === 'send' ? 'transactionHash' : null;
		let resName = method === 'estimateGas' ? 'gas' : 'hash';
		if (method === 'estimateGas') {
			// TODO: fix generic gas estimation
			return { [resName]: 100000, contract: this.address };
		}
		if (!opt.gas) {
			opt.gas = 100000;
		}
		let hash = await this.web3.waitForTicket({
			method,
			contractMethodArgs: args || [],
			contractAddress: this.address,
			contractMethod,
			customAbi: this.abi,
			onceListenerName,
			args: [opt]
		});
		// TODO: add pending transactions to db
		return { [resName]: hash, contract: this.address };
	}

	async call(options) {
		return {
			res: await this.web3.waitForTicket({
				method: 'call',
				contractMethodArgs: options.args || [],
				contractAddress: this.address,
				contractMethod: options.method,
				customAbi: this.abi,
				args: [options.options || {}]
			}),
			contract: this.address
		};
	}
}

export class StakingContract extends EtheriumContract {
	constructor(web3, address, abi, isDeprecated) {
		super(web3, address, abi);
		this.isDeprecated = isDeprecated;
	}

	async getBalance(serviceAddress, serviceId, options) {
		serviceId = this.web3.ensureStrHex(serviceId);
		let res = await this.call({
			args: [options.from, serviceAddress, serviceId],
			options,
			method: 'balances'
		});
		return res.res;
	}

	deposit(amount, serviceAddress, serviceId, options) {
		serviceId = this.web3.ensureStrHex(serviceId);
		amount = this.web3.ensureIntHex(amount);
		options = { method: 'send', ...options };
		return this.send({
			args: [amount, serviceAddress, serviceId],
			options,
			method: 'deposit'
		});
	}

	withdraw(serviceAddress, serviceId, options) {
		serviceId = this.web3.ensureStrHex(serviceId);
		options = { method: 'send', ...options };
		return this.send({
			args: [serviceAddress, serviceId],
			options,
			method: 'withdraw'
		});
	}

	async getReleaseDate(serviceAddress, serviceId, options) {
		serviceId = this.web3.ensureStrHex(serviceId);
		let res = await this.call({
			args: [options.from, serviceAddress, serviceId],
			options,
			method: 'releaseDates'
		});
		return res.res;
	}

	async getLockPeriod(serviceAddress, serviceId, options) {
		serviceId = this.web3.ensureStrHex(serviceId);
		let res = await this.call({
			args: [serviceAddress, serviceId],
			options: { ...options },
			method: 'lockPeriods'
		});
		return res.res;
	}
}

export class SelfKeyTokenContract extends EtheriumContract {
	constructor(web3, token) {
		super(web3, token.address, SELFKEY_ABI);
		this.token = token;
	}
	approve(depositVaultAddress, maxAmount, options) {
		options = { method: 'send', ...options };
		maxAmount = this.web3.ensureIntHex(maxAmount);
		return this.send({
			args: [depositVaultAddress, maxAmount],
			options,
			method: 'approve'
		});
	}

	allowance(depositVaultAddress, options) {
		return this.call({
			args: [options.from, depositVaultAddress],
			options: { ...options },
			method: 'allowance'
		}).res;
	}
}

export default StakingService;
