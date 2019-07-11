import PaymentService from './payment-service';

xdescribe('PaymentService', () => {
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

	beforeEach(() => {
		service = new PaymentService({ web3Service, selfkeyService });
	});

	it('makePayment', async () => {
		const contractSpy = jest.spyOn(web3Service.web3.eth, 'Contract');
		const makePaymentSpy = jest.spyOn(payment.methods, 'makePayment');
		const transaction = await service.makePayment(...params);
		expect(contractSpy).toHaveBeenCalled();
		expect(makePaymentSpy).toHaveBeenCalled();
		expect(transaction.hash).toEqual('hash');
	});
});
