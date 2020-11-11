import moment from 'moment';
import config from 'common/config';
import { Wallet } from '../../wallet/wallet';
import Token from '../../token/token';
import BN from 'bignumber.js';

export class StakingService {
	constructor({ contractService, web3Service, walletTokenService }) {
		this.contractService = contractService;
		this.web3Service = web3Service;
		this.walletTokenService = walletTokenService;
	}
	async fetchStake(walletId) {
		let contracts = await this.contractService.findByType('staking');
		contracts = contracts.filter(c => !c.deprecated);
		if (!contracts.length) {
			return null;
		}

		const contractInfo = contracts[0];

		const contract = new this.web3Service.web3.eth.Contract(
			contractInfo.abi,
			contractInfo.address
		);

		const wallet = await Wallet.findById(walletId);
		const [token] = await Token.findBySymbol(config.constants.primaryToken);

		const keyBalance = await contract.methods
			.balances(token.address, wallet.address)
			.call({ from: wallet.address });

		const timelockEnd = await contract.methods
			.timelocks(token.address, wallet.address)
			.call({ from: wallet.address });

		const timelockStart = moment()
			.utc()
			.valueOf();

		const stakeBalance = new BN(keyBalance).div(new BN(10).pow(token.decimal)).toString();

		return {
			stakeBalance: stakeBalance,
			rewardBalance: '8000',
			timelockStart,
			timelockEnd,
			minStakeAmount: '10000'
		};
	}
}
