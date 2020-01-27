'use strict';

import EventEmitter from 'events';
import Web3Service from 'main/blockchain/web3-service';
import { Logger } from 'common/logger';

const { getWallet } = require('common/wallet/selectors');
const { getTokens } = require('common/wallet-tokens/selectors');
const { walletOperations } = require('common/wallet');
const { walletTokensOperations } = require('common/wallet-tokens');
const store = require('renderer/react/common/store').default;
const log = new Logger('BalanceUpdaterService');
const web3Service = new Web3Service();

let txInfoCheckInterval = null;
const TX_CHECK_INTERVAL = 1500;

export class BalanceUpdaterService extends EventEmitter {
	updateWalletBalance() {
		return store.dispatch(walletOperations.updateWallet(this.getCurrentWallet()));
	}

	updateTokensBalance() {
		let tokens = this.getCurrentWalletTokens();
		let wallet = this.getCurrentWallet();
		return store.dispatch(walletTokensOperations.updateWalletTokens(tokens, wallet.address));
	}

	getCurrentWallet() {
		return getWallet(store.getState());
	}

	getCurrentWalletTokens() {
		return getTokens(store.getState());
	}

	async updateBalances(oldBalance) {
		await this.updateWalletBalance();
		await this.updateTokensBalance();

		let currentWallet = this.getCurrentWallet();
		if (oldBalance === currentWallet.balance) {
			setTimeout(() => {
				this.updateBalances(oldBalance);
			}, TX_CHECK_INTERVAL);
		}
	}

	async startTxCheck(txHash, oldBalance) {
		let me = this;
		txInfoCheckInterval = setInterval(async () => {
			try {
				let txInfo = await web3Service.waitForTicket({
					method: 'getTransactionReceipt',
					args: [txHash]
				});

				if (txInfo && txInfo.blockNumber !== null) {
					let status = Number(txInfo.status);
					this.emit('tx-status:change', txHash, status);

					if (status) {
						me.updateBalances(oldBalance);
					}
					clearInterval(txInfoCheckInterval);
				}
			} catch (error) {
				log.error('tx check error', error);
			}
		}, TX_CHECK_INTERVAL);
	}

	async startTxBalanceUpdater(sendPromise) {
		let me = this;
		let currentWallet = me.getCurrentWallet();
		sendPromise.then(txHash => {
			me.startTxCheck(txHash, currentWallet.balance);
		});
	}
}

export default BalanceUpdaterService;
