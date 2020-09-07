import { getGlobalContext } from 'common/context';
import { abi as ledgerABI } from 'main/assets/data/DIDLedger.json';
import config from 'common/config';
import { Logger } from 'common/logger';

const log = new Logger('DIDService');

export class DIDService {
	constructor() {
		this.web3Service = getGlobalContext().web3Service;
		this.zero = '0x0000000000000000000000000000000000000000000000000000000000000000';
	}

	createDID(walletAddress, gas) {
		const ledger = new this.web3Service.web3.eth.Contract(ledgerABI, config.ledgerAddress);
		ledger.transactionConfirmationBlocks = 2;
		ledger.transactionBlockTimeout = 750;
		return ledger.methods.createDID(this.zero).send({ from: walletAddress, gas });
	}

	async getControllerAddress(did) {
		const ledger = new this.web3Service.web3.eth.Contract(ledgerABI, config.ledgerAddress);
		return ledger.methods.getController(did.replace('did:selfkey:', '')).call();
	}

	async getGasLimit(from) {
		const ledger = new this.web3Service.web3.eth.Contract(ledgerABI, config.ledgerAddress);
		const MAX_GAS = 4500000;
		try {
			const estimate = await ledger.methods.createDID(this.zero).estimateGas({ from });
			return Math.round(Math.min(estimate * 1.1, MAX_GAS));
		} catch (error) {
			log.error(error);
			throw error;
		}
	}
}

export default DIDService;
