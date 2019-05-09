import { getGlobalContext } from 'common/context';
import { abi as ledgerABI } from 'main/assets/data/DIDLedger.json';
const ledgerAddress = '0x24512422CF6AD1c0C465cBF0Bbd5155EaA3DA634';

export class DIDService {
	constructor() {
		this.web3Service = getGlobalContext().web3Service;
		this.zero = this.web3Service.web3.utils.hexToBytes(
			'0x0000000000000000000000000000000000000000000000000000000000000000'
		);
	}

	async createDID(walletAddress) {
		const ledger = new this.web3Service.web3.eth.Contract(ledgerABI, ledgerAddress);
		const gas = await this.getGasLimit(walletAddress);
		return ledger.methods.createDID(this.zero).send({ from: walletAddress, gas });
	}

	async getControllerAddress(did) {
		const ledger = new this.web3Service.web3.eth.Contract(ledgerABI, ledgerAddress);
		return ledger.methods.getController(did).call();
	}

	async getGasLimit(walletAddress) {
		const ledger = new this.web3Service.web3.eth.Contract(ledgerABI, ledgerAddress);
		const MAX_GAS = 4500000;
		const estimate = await ledger.methods
			.createDID(this.zero)
			.estimateGas(walletAddress, MAX_GAS);
		return Math.round(Math.min(estimate * 1.1, MAX_GAS));
	}
}

export default DIDService;
