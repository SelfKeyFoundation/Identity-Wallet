import ContractAllowance from './contract-allowance';

export class ContractAllowanceService {
	constructor({ web3Service }) {
		this.web3Service = web3Service;
	}

	createContractAllowance(walletId, contractAddress, tokenAddress) {
		return ContractAllowance.create({ walletId, contractAddress, tokenAddress });
	}

	loadContractAllowances(walletId) {
		// TODO: load amounts from contracts
		return ContractAllowance.findAll({ walletId });
	}

	loadContractAllowanceById(id) {
		// TODO: load amount from contract
		return ContractAllowance.findById();
	}
}

export default ContractAllowanceService;
