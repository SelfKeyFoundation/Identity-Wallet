import erc20Abi from 'human-standard-token-abi';
import _ from 'lodash';

export class ERC20Token {
	constructor(address, web3Service) {
		this.web3Service = web3Service;
		this.address = address;
		this.contract = web3Service.web3.eth.Contract(erc20Abi, address);
		this.symbol = null;
	}

	approve(spender, amount, options) {
		const method = this.contract.approve(spender, amount).encodeABI();
		if (options.estimateGas) {
			return method.estimateGas(_.pick(options, ['from', 'gas', 'value']));
		}

		return method.send(_.pick(options, ['from', 'gas', 'value', 'gasPrice']));
	}

	allowance(owner, spender, options) {
		const data = this.contract.allowance(owner, spender).encodeABI();
		const args = _.pick(options, ['from', 'gas', 'gasPrice']);
		return this.web3Service.waitForTicket({
			method: 'call',
			args: [
				{
					...args,
					data,
					to: this.address
				}
			]
		});
	}
}

export default ERC20Token;
