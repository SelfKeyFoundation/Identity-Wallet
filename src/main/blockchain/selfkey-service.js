import { getGlobalContext } from 'common/context';
import { abi as selfkeyABI } from 'main/assets/data/abi.json';
import config from 'common/config';
import { Token } from '../token/token';

export class SelfkeyService {
	constructor() {
		this.web3Service = getGlobalContext().web3Service;
	}

	async approve(walletAddress, contractAddress, amount) {
		const selfkey = new this.web3Service.web3.eth.Contract(
			selfkeyABI,
			await this.getTokenAddress()
		);
		return selfkey.methods.approve(contractAddress, amount).send({ from: walletAddress });
	}

	async getTokenAddress() {
		const token = await Token.findOneBySymbol(config.constants.primaryToken.toUpperCase());
		return token.address;
	}
}
export default SelfkeyService;
