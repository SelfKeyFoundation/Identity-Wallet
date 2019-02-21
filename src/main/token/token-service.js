'use strict';
import Token from './token';
import { getGlobalContext } from 'common/context';
import { BigNumber } from 'bignumber.js';

export class TokenService {
	constructor() {
		this.web3Service = getGlobalContext().web3Service;
		this.contractABI = this.web3Service.abi;
	}

	loadTokens() {
		return Token.findAll();
	}

	async addToken(token) {
		const existingToken = await Token.findByAddress(token.address);
		if (existingToken.length > 0) {
			return existingToken[0];
		}
		token.isCustom = 1;
		return Token.create(token);
	}

	async getTokenInfo(contractAddress) {
		const tokenContract = new this.web3Service.web3.eth.Contract(
			this.contractABI,
			contractAddress
		);
		const decimal = parseInt(await tokenContract.methods.decimals().call());
		const symbol = await tokenContract.methods.symbol().call();

		return {
			address: contractAddress,
			symbol,
			decimal
		};
	}

	async getGasLimit(contractAddress, address, amount, walletAddress) {
		const tokenContract = new this.web3Service.web3.eth.Contract(
			this.contractABI,
			contractAddress
		);
		const MAX_GAS = 4500000;
		const amountInWei = this.web3Service.web3.utils.toWei(new BigNumber(amount).toString());
		return tokenContract.methods
			.transfer(address, amountInWei)
			.estimateGas(walletAddress, MAX_GAS);
	}
}

export default TokenService;
