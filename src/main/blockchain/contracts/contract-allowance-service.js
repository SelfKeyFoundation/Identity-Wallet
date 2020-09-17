import ContractAllowance from './contract-allowance';

export class ContractAllowanceService {
	constructor({ web3Service }) {
		this.web3Service = web3Service;
	}

	loadContractAllowances(walletId) {
		return ContractAllowance.findAll({ walletId });
	}
}

export default ContractAllowanceService;
