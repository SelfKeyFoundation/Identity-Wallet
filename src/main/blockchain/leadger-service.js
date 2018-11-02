'use strict';
import 'babel-polyfill';
import { timeout } from 'promise-timeout';
import Web3 from 'web3';
import ProviderEngine from 'web3-provider-engine';
import FetchSubprovider from 'web3-provider-engine/subproviders/fetch';
import HWTransportNodeHid from '@ledgerhq/hw-transport-node-hid';
import Web3SubProvider from '@ledgerhq/web3-subprovider';
import { chainId } from 'common/config';
import { SELECTED_SERVER_URL } from './web3-service';

export class LedgerService {
	constructor({ web3Service }) {
		this.web3Service = web3Service;
	}

	createWeb3(accountsOffset, accountsQuantity) {
		accountsOffset = accountsOffset || 0;
		accountsQuantity = accountsQuantity || 6;
		const engine = new ProviderEngine();
		const getTransport = () => HWTransportNodeHid.create();
		const ledger = Web3SubProvider(getTransport, {
			networkId: chainId,
			accountsLength: accountsQuantity,
			accountsOffset
		});

		engine.addProvider(ledger);
		engine.addProvider(new FetchSubprovider({ rpcUrl: SELECTED_SERVER_URL }));
		engine.start();
		return new Web3(engine);
	}
	signTransaction(args) {
		args.dataToSign.from = args.address;
		let signPromise = this.web3Service.waitForTicket({
			method: 'signTransaction',
			args: [args.dataToSign],
			contractAddress: null,
			contractMethod: null,
			onceListenerName: null,
			customWeb3: this.createWeb3()
		});
		return timeout(signPromise, 30000);
	}
	getAccounts(args) {
		return this.web3Service.waitForTicket({
			method: 'getAccounts',
			args: [],
			contractAddress: null,
			contractMethod: null,
			onceListenerName: null,
			customWeb3: this.createWeb3(args.start, args.quantity)
		});
	}
}

export default LedgerService;
