import _ from 'lodash';
import { MarketplaceTransactions } from './marketplace-transactions';
import { getWallet } from '../../common/wallet/selectors';
import CONFIG from '../../common/config';
import BN from 'bignumber.js';

export class MarketplaceService {
	constructor({ store, stakingService, web3Service }) {
		this.store = store;
		this.stakingService = stakingService;
		this.web3Service = web3Service;
	}
	get wallet() {
		return getWallet(this.store.getState());
	}
	get walletAddress() {
		if (!this.wallet || !this.wallet.publicKey) return null;
		return `0x${this.wallet.publicKey}`;
	}
	loadTransactions(serviceOwner, serviceId) {
		return MarketplaceTransactions.find({ serviceOwner, serviceId });
	}
	loadStakingInfo(serviceOwner, serviceId) {
		let options = { from: this.walletAddress };
		return this.stakingService.getStakingInfo(serviceOwner, serviceId, options);
	}
	async estimateGasForStake(serviceOwner, serviceId, amount) {
		let options = { from: this.walletAddress, method: 'estimateGas' };
		let limits = await this.stakingService.placeStake(amount, serviceOwner, serviceId, options);
		return (limits.approve || 0) + (limits.deposit || 0);
	}
	estimateGasForWithdraw(serviceOwner, serviceId) {
		let options = { from: this.walletAddress, method: 'estimateGas' };
		return this.stakingService.withdrawStake(serviceOwner, serviceId, options);
	}
	async placeStake(serviceOwner, serviceId, amount, gasPrice, gas) {
		let options = { from: this.walletAddress, gasPrice, gas };
		amount = new BN(amount).times(new BN(10).pow(18)).toString();
		let blockchainTx = [];
		let tx = await this.stakingService.placeStake(amount, serviceOwner, serviceId, options);

		if (tx.approve) {
			blockchainTx.push(tx.approve);
		}

		if (tx.deposit) {
			blockchainTx.push(tx.deposit);
		}

		return MarketplaceTransactions.create({
			serviceOwner,
			serviceId,
			action: 'placeStake',
			amount,
			gasPrice,
			gasLimit: gas,
			networkId: CONFIG.chainId,
			blockchainTx,
			lastStatus: 'pending'
		});
	}
	async withdrawStake(serviceOwner, serviceId, gasPrice, gas) {
		let options = { from: this.walletAddress, gas, gasPrice };
		let blockchainTx = [
			await this.stakingService.withdrawStake(serviceOwner, serviceId, options)
		];
		return MarketplaceTransactions.create({
			serviceOwner,
			serviceId,
			action: 'withdrawStake',
			amount: '0',
			gasPrice,
			gasLimit: gas,
			networkId: CONFIG.chainId,
			blockchainTx,
			lastStatus: 'pending'
		});
	}
	async checkMpTxStatus(tx) {
		let statusMap = {
			failed: 1,
			pending: 2,
			processing: 3,
			success: 4
		};
		let statuses = await Promise.all(
			(tx.blockchainTx || []).map(tx => this.web3Service.checkTransactionStatus(tx.hash))
		);

		let status = statuses.reduce((acc, curr) => {
			if (!statusMap[acc]) return curr;
			if (!statusMap[curr]) return acc;
			if (statusMap[curr] < statusMap[acc]) return curr;
			return acc;
		}, 'new');
		return status;
	}
	async updateTransaction(tx) {
		return MarketplaceTransactions.updateById(tx.id, _.omit(tx, 'id'));
	}
}

export default MarketplaceService;
