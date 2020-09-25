import ERC20Token from '../../token/erc20-token';
import ContractAllowance from './contract-allowance';
import { Wallet } from '../../wallet/wallet';
import { Logger } from 'common/logger';

const log = new Logger('ContractAllowanceService');

export class ContractAllowanceService {
	constructor({ web3Service }) {
		this.web3Service = web3Service;
	}

	createContractAllowance(walletId, contractAddress, tokenAddress) {
		return ContractAllowance.create({ walletId, contractAddress, tokenAddress });
	}

	async fetchContractAllowance(ownerAddress, tokenAddress, contractAddress) {
		const token = new ERC20Token(tokenAddress, this.web3Service);
		const allowance = await token.getAllowance(ownerAddress, contractAddress, {
			from: ownerAddress
		});
		return allowance;
	}

	async loadContractAllowances(walletId) {
		const wallet = await Wallet.findById(walletId);
		const allowances = await ContractAllowance.findAll({ walletId });
		return Promise.all(
			allowances.map(a => async () => {
				try {
					const amount = await this.fetchContractAllowance(
						wallet.address,
						a.tokenAddress,
						a.contractAddress
					);
					return { ...a, amount };
				} catch (error) {
					log.error(error);
					return a;
				}
			})
		);
	}

	async loadContractAllowanceById(id) {
		const allowance = await ContractAllowance.findById(id).eager('wallet');
		try {
			allowance.amount = await this.fetchContractAllowance(
				allowance.wallet.address,
				allowance.tokenAddress,
				allowance.contractAddress
			);
		} catch (error) {
			log.error(error);
		}

		return allowance;
	}

	updateContractAllowanceById(id, update) {
		return ContractAllowance.updateById(id, update);
	}

	updateContractAllowanceAmount(tokenAddress, contractAddress, amount, options) {
		const token = new ERC20Token(tokenAddress, this.web3Service);
		return token.approve(contractAddress, amount, options);
	}
}

export default ContractAllowanceService;
