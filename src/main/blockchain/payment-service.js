import { abi as paymentSplitterABI } from 'main/assets/data/PaymentSplitter.json';
import config from 'common/config';

export class PaymentService {
	constructor({ web3Service, selfkeyService }) {
		this.web3Service = web3Service;
		this.selfkeyService = selfkeyService;
	}

	async makePayment(
		walletAddress,
		senderDID,
		recipientDID,
		amount,
		purchaseInfo,
		affiliate1Split,
		affiliate2Split,
		gas,
		gasPrice,
		onTransactionHash
	) {
		const paymentSplitter = new this.web3Service.web3.eth.Contract(
			paymentSplitterABI,
			config.paymentSplitterAddress
		);
		this.web3Service.web3.transactionConfirmationBlocks = 2;
		const nonce = await this.web3Service.web3.eth.getTransactionCount(walletAddress, 'pending');
		const tokenAddress = await this.selfkeyService.getTokenAddress();
		let promise = paymentSplitter.methods
			.makePayment(
				tokenAddress,
				senderDID,
				recipientDID,
				amount,
				this.web3Service.ensureStrHex(purchaseInfo),
				affiliate1Split,
				affiliate2Split
			)
			.send({ from: walletAddress, gas, gasPrice, nonce });

		if (onTransactionHash) {
			promise.on('transactionHash', onTransactionHash);
		}
		return new Promise((resolve, reject) => {
			promise.on('receipt', receipt => resolve(receipt));
			promise.on('error', error => reject(error));
		});
	}

	async getGasLimit() {
		return 45000;
	}
}

export default PaymentService;
