import { getGlobalContext } from 'common/context';
import { abi as ledgerABI } from 'main/assets/data/DIDLedger.json';
const ledgerAddress = '0x24512422CF6AD1c0C465cBF0Bbd5155EaA3DA634';

export class DIDService {
	constructor() {
		this.web3Service = getGlobalContext().web3Service;
	}

	async createDID() {
		const ledger = new this.web3Service.web3.eth.Contract(ledgerABI, ledgerAddress);
		const zero = this.web3Service.web3.utils.hexToBytes(
			'0x0000000000000000000000000000000000000000000000000000000000000000'
		);
		return ledger.methods.createDID(zero).send();
	}

	async getControllerAddress(did) {
		const ledger = new this.web3Service.web3.eth.Contract(ledgerABI, ledgerAddress);
		return ledger.methods.getController(did).call();
	}
}

export default DIDService;
