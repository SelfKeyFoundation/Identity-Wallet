import SelfkeyService from './selfkey-service';

xdescribe('SelfkeyService', () => {
	let service = null;
	const selfkey = {
		methods: {
			approve: () => {
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
				Contract: () => selfkey
			},
			utils: {
				hexToBytes: () => {}
			}
		}
	};

	beforeEach(() => {
		service = new SelfkeyService({ web3Service });
	});

	it('approve', async () => {
		const contractSpy = jest.spyOn(web3Service.web3.eth, 'Contract');
		const approveSpy = jest.spyOn(selfkey.methods, 'approve');
		const transaction = await service.approve('walet', 'contract', 1000);
		expect(contractSpy).toHaveBeenCalled();
		expect(approveSpy).toHaveBeenCalled();
		expect(transaction.hash).toEqual('hash');
	});
});
