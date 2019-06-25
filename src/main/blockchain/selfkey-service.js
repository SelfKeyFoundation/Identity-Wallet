import { abi as selfkeyABI } from 'main/assets/data/abi.json';
import config from 'common/config';
import { Token } from '../token/token';

export class SelfkeyService {
	constructor({ web3Service }) {
		this.web3Service = web3Service;
		this.web3Service.web3.transactionConfirmationBlocks = 2;
	}

	async approve(walletAddress, contractAddress, amount, gas) {
		const selfkey = new this.web3Service.web3.eth.Contract(
			selfkeyABI,
			await this.getTokenAddress()
		);
		return selfkey.methods.approve(contractAddress, amount).send({ from: walletAddress, gas });
	}

	async estimateApproveGasLimit(walletAddress, contractAddress, amount) {
		const selfkey = new this.web3Service.web3.eth.Contract(
			selfkeyABI,
			await this.getTokenAddress()
		);
		return selfkey.methods
			.approve(contractAddress, amount)
			.estimateGas({ from: walletAddress });
	}

	async getAllowance(walletAddress, contractAddress) {
		const selfkey = new this.web3Service.web3.eth.Contract(
			selfkeyABI,
			await this.getTokenAddress()
		);
		return selfkey.methods
			.allowance(walletAddress, contractAddress)
			.call({ from: walletAddress });
	}

	async getTokenAddress() {
		const token = await Token.findOneBySymbol(config.constants.primaryToken.toUpperCase());
		return token.address;
	}
}
export default SelfkeyService;
