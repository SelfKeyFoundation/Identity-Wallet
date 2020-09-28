import ERC20Token from '../../token/erc20-token';
import ContractAllowance from './contract-allowance';
import { Wallet } from '../../wallet/wallet';
import { Logger } from 'common/logger';

const log = new Logger('ContractAllowanceService');

export class ContractAllowanceService {
	constructor({ web3Service }) {
		this.web3Service = web3Service;
	}

	createContractAllowance(walletId, contractAddress, tokenAddress, tokenDecimals) {
		return ContractAllowance.create({ walletId, contractAddress, tokenAddress, tokenDecimals });
	}

	async fetchContractAllowance(ownerAddress, tokenAddress, contractAddress, tokenDecimals) {
		const token = new ERC20Token(tokenAddress, this.web3Service, tokenDecimals);
		const allowance = await token.getAllowance(ownerAddress, contractAddress, {
			from: ownerAddress
		});
		return allowance;
	}

	async loadContractAllowances(walletId) {
		const wallet = await Wallet.findById(walletId);

		let allowances = await ContractAllowance.findAll({ walletId });
		return Promise.all(
			allowances.map(async a => {
				try {
					const allowanceAmount = await this.fetchContractAllowance(
						wallet.address,
						a.tokenAddress,
						a.contractAddress,
						a.tokenDecimals
					);
					return { ...a, allowanceAmount };
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
			allowance.allowanceAmount = await this.fetchContractAllowance(
				allowance.wallet.address,
				allowance.tokenAddress,
				allowance.contractAddress,
				allowance.tokenDecimals
			);
		} catch (error) {
			log.error(error);
		}

		return allowance;
	}

	updateContractAllowanceById(id, update) {
		return ContractAllowance.updateById(id, update);
	}

	updateContractAllowanceAmount(tokenAddress, contractAddress, amount, tokenDecimals, options) {
		const token = new ERC20Token(tokenAddress, this.web3Service, tokenDecimals);
		return token.approve(contractAddress, amount, options);
	}
}

export default ContractAllowanceService;
