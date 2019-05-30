import { getGlobalContext } from 'common/context';
import { abi as paymentSplitterABI } from 'main/assets/data/PaymentSplitter.json';
import config from 'common/config';

export class PaymentService {
	constructor() {
		this.web3Service = getGlobalContext().web3Service;
		this.selfkeyService = getGlobalContext().selfkeyService;
	}

	async makePayment(
		walletAddress,
		senderDID,
		recipientDID,
		amount,
		purchaseInfo,
		affiliate1Split,
		affiliate2Split,
		gas
	) {
		const paymentSplitter = new this.web3Service.web3.eth.Contract(
			paymentSplitterABI,
			config.paymentSplitterAddress
		);
		this.web3Service.web3.transactionConfirmationBlocks = 2;
		const tokenAddress = await this.selfkeyService.getTokenAddress();
		return paymentSplitter.methods
			.makePayment(
				tokenAddress,
				senderDID,
				recipientDID,
				amount,
				purchaseInfo,
				affiliate1Split,
				affiliate2Split
			)
			.send({ from: walletAddress, gas });
	}

	async getGasLimit(
		walletAddress,
		senderDID,
		recipientDID,
		amount,
		purchaseInfo,
		affiliate1Split,
		affiliate2Split
	) {
		const paymentSplitter = new this.web3Service.web3.eth.Contract(
			paymentSplitterABI,
			config.paymentSplitterAddress
		);
		const tokenAddress = await this.selfkeyService.getTokenAddress();
		const MAX_GAS = 4500000;
		const estimate = await paymentSplitter.methods
			.makePayment(
				tokenAddress,
				senderDID,
				recipientDID,
				amount,
				purchaseInfo,
				affiliate1Split,
				affiliate2Split
			)
			.estimateGas({ walletAddress });
		return Math.round(Math.min(estimate * 1.1, MAX_GAS));
	}
}

export default PaymentService;
