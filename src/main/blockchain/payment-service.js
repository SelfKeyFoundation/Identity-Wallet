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

	async getGasLimit() {
		return 450000;
	}
}

export default PaymentService;
