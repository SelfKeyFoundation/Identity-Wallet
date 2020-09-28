// import erc20Abi from 'human-standard-token-abi';
import { abi as ABI } from 'main/assets/data/abi.json';
import _ from 'lodash';
import BN from 'bignumber.js';

export class ERC20Token {
	constructor(address, web3Service, decimals = 18) {
		this.web3Service = web3Service;
		this.address = address;
		this.decimals = decimals;
		this.contract = new web3Service.web3.eth.Contract(ABI, address);
		this.contract.transactionConfirmationBlocks = 2;
		this.contract.transactionBlockTimeout = 750;
	}

	approve(spender, amount, options) {
		amount = this.web3Service.ensureIntHex(
			new BN(amount).times(new BN(10).pow(this.decimals)).toString(10)
		);
		const method = this.contract.methods.approve(spender, amount);
		if (options.estimateGas) {
			return method.estimateGas(_.pick(options, ['from', 'gas', 'value']));
		}

		return method.send(_.pick(options, ['from', 'gas', 'value', 'gasPrice']));
	}

	async getAllowance(owner, spender, options) {
		const data = this.contract.methods.allowance(owner, spender).encodeABI();
		const args = _.pick(options, ['from', 'gas', 'gasPrice']);
		const allowance = await this.web3Service.waitForTicket({
			method: 'call',
			args: [
				{
					...args,
					data,
					to: this.address
				}
			]
		});
		return new BN(allowance).div(new BN(10).pow(this.decimals)).toString(10);
	}
}

export default ERC20Token;
