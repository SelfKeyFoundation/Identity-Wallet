import PaymentService from './payment-service';
import { setGlobalContext } from 'common/context';

describe('PaymentService', () => {
	let service = null;
	const payment = {
		methods: {
			makePayment: () => {
				return {
					send: () => {
						return { hash: 'hash' };
					},
					estimateGas: () => 1000
				};
			}
		}
	};
	const web3Service = {
		web3: {
			eth: {
				Contract: () => payment
			},
			utils: {
				hexToBytes: () => {}
			}
		}
	};

	const selfkeyService = {
		getTokenAddress: () => {
			return 'token';
		}
	};
	const params = [
		'wallet',
		'senderDID',
		'recipientDID',
		1000,
		'info',
		'affiliate1Split',
		'affiliate1Split',
		2000
	];

	setGlobalContext({ web3Service, selfkeyService });

	beforeEach(() => {
		service = new PaymentService();
	});

	it('makePayment', async () => {
		const contractSpy = jest.spyOn(web3Service.web3.eth, 'Contract');
		const makePaymentSpy = jest.spyOn(payment.methods, 'makePayment');
		const transaction = await service.makePayment(...params);
		expect(contractSpy).toHaveBeenCalled();
		expect(makePaymentSpy).toHaveBeenCalled();
		expect(transaction.hash).toEqual('hash');
	});

	it('getGasLimit', async () => {
		const contractSpy = jest.spyOn(web3Service.web3.eth, 'Contract');
		const makePaymentSpy = jest.spyOn(payment.methods, 'makePayment');
		const gasLimit = await service.getGasLimit(...params);
		expect(contractSpy).toHaveBeenCalled();
		expect(makePaymentSpy).toHaveBeenCalled();
		expect(gasLimit).toEqual(1100);
	});
});
