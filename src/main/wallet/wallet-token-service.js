import { WalletToken } from './wallet-token';
import { Logger } from 'common/logger';
import { getGlobalContext } from 'common/context';
import EthUtils from 'common/utils/eth-utils';
import Token from '../token/token';

const log = new Logger('wallet-tokens-service');
export class WalletTokenService {
	constructor() {
		this.web3Service = getGlobalContext().web3Service;
		this.contractABI = this.web3Service.abi;
	}

	getWalletTokens(walletId) {
		return WalletToken.findByWalletId(walletId, true);
	}

	async populateWalletWithPopularTokens(wallet) {
		const popularList = require('../assets/data/popular-tokens.json');
		const allTokens = await Token.findAll().whereIn('address', popularList);

		const popular = await Promise.all(
			popularList.map(async addr => {
				const token = allTokens.find(t => t.address === addr);
				if (!token) {
					return null;
				}
				let balance = 0;
				try {
					balance = await this.getTokenBalance(addr, wallet.address);
				} catch (error) {
					log.warn(error);
				}

				return {
					walletId: wallet.id,
					tokenId: token.id,
					balance
				};
			})
		);
		await WalletToken.insertMany(popular);
	}

	// TODO use the test ABI when in dev mode
	async getTokenBalance(contractAddress, address) {
		const tokenContract = new this.web3Service.web3.eth.Contract(
			this.contractABI,
			contractAddress
		);
		const balanceWei = await tokenContract.methods.balanceOf(address).call();
		const decimals = await tokenContract.methods.decimals().call();
		return EthUtils.getBalanceDecimal(balanceWei, decimals);
	}

	createWalletToken(tokenId, walletId) {
		return WalletToken.create({ tokenId, walletId });
	}

	updateState(id, state) {
		return WalletToken.update({ id, recordState: state });
	}
}

export default WalletTokenService;
