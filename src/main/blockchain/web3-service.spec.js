import sinon from 'sinon';
import Web3Service from './web3-service';

let mockPromise = Promise.resolve('ok');

const contractMethods = {
	contractMethod1() {
		return contractSubmethods;
	}
};

const contractSubmethods = {
	method1() {
		return mockPromise;
	},
	method2() {
		return mockPromise;
	}
};
class ContractMock {
	constructor(ABI, contractAddress) {
		this.ABI = ABI;
		this.contractAddress = contractAddress;
		this.methods = contractMethods;
	}
	method1() {
		return mockPromise;
	}
	method2() {
		return mockPromise;
	}
}

const ethMock = {
	sendSignedTransaction() {
		return mockPromise;
	},
	getTransactionCount() {
		return Promise.resolve(15);
	},
	getGasPrice() {
		return Promise.resolve(100);
	},
	Contract: ContractMock,
	method1() {
		return mockPromise;
	},
	method2() {
		return mockPromise;
	}
};
const ethUtilMock = {
	toHex() {
		return 'test';
	},
	hexToNumber(hex) {
		if (hex === '0x0') return 0;
		return 1;
	},
	isHex(str) {
		return true;
	},
	asciiToHex(str) {
		return str;
	},
	numberToHex(num) {
		return num;
	}
};

describe('Web3Service', () => {
	let store = null;
	let service = null;
	beforeEach(() => {
		store = {
			getState() {
				return this.state;
			},
			state: { wallet: null }
		};
		service = new Web3Service({ store });
	});
	afterEach(() => {
		sinon.restore();
	});
	it('waitForTicket', async () => {
		service.ensureRequestInterval = cb => cb();
		service.web3.eth = ethMock;

		let spy = sinon.spy(ethMock, 'method1');
		let res = await service.waitForTicket({
			method: 'method1',
			args: []
		});
		expect(res).toBe('ok');
		expect(ethMock.method1.calledOnce).toBeTruthy();
		spy.restore();

		spy = sinon.spy(contractSubmethods, 'method1');
		res = await service.waitForTicket({
			method: 'method1',
			contractAddress: '12345',
			contractMethod: 'contractMethod1',
			args: []
		});
		expect(res).toBe('ok');
		expect(contractSubmethods.method1.calledOnce).toBeTruthy();
	});
	describe('handleTicket', () => {});

	describe('sendSignedTransaction', () => {
		let contractAddress = 'test';
		it('sends custom transaction for local profile', async () => {
			let contactMethodInstance = {
				encodeABI: sinon.stub(),
				estimateGas: sinon.stub().resolves(100)
			};
			let wallet = { address: '0xtest', privateKey: 'test', profile: 'local' };
			store.state.wallet = wallet;
			const args = { from: wallet.address };
			sinon.stub(ethMock, 'sendSignedTransaction').resolves('ok');
			service.web3.eth = ethMock;
			service.web3.utils = ethUtilMock;
			await service.sendSignedTransaction(
				contactMethodInstance,
				contractAddress,
				[args],
				wallet
			);
			expect(contactMethodInstance.encodeABI.calledOnce).toBeTruthy();
			expect(ethMock.sendSignedTransaction.calledOnce).toBeTruthy();
		});
		it('uses regular send method for non local profiles', async () => {
			let contactMethodInstance = { send: sinon.stub() };
			let wallet = { address: '0xtest', privateKey: 'test', profile: 'test' };
			store.state.wallet = wallet;
			const args = { from: wallet.address };
			await service.sendSignedTransaction(contactMethodInstance, contractAddress, [args]);
			expect(contactMethodInstance.send.calledOnceWith(args)).toBeTruthy();
			store.state.wallet = {};
			await service.sendSignedTransaction(
				contactMethodInstance,
				contractAddress,
				[args],
				wallet
			);
			expect(contactMethodInstance.send.calledOnceWith([args]));
		});
		it('throws an error if no wallet unlocked', async () => {});
	});

	it('getTransaction', async () => {
		sinon.stub(service, 'waitForTicket').resolves('ok');
		let hash = 'test';
		let res = await service.getTransaction(hash);
		expect(res).toEqual('ok');
		expect(service.waitForTicket.calledOnce).toBeTruthy();
		expect(service.waitForTicket.getCall(0).args[0]).toEqual({
			method: 'getTransaction',
			args: [hash]
		});
	});

	it('getTransactionReceipt', async () => {
		sinon.stub(service, 'waitForTicket').resolves('ok');
		let hash = 'test';
		let res = await service.getTransactionReceipt(hash);
		expect(res).toEqual('ok');
		expect(service.waitForTicket.calledOnce).toBeTruthy();
		expect(service.waitForTicket.getCall(0).args[0]).toEqual({
			method: 'getTransactionReceipt',
			args: [hash]
		});
	});

	describe('ensureStrHex', () => {
		it('convers ascii to hex if str not hex', () => {
			service.web3.utils = ethUtilMock;
			sinon.stub(ethUtilMock, 'isHex').returns(false);
			sinon.stub(ethUtilMock, 'asciiToHex').returns('hex');

			let str = service.ensureStrHex('str');
			expect(ethUtilMock.isHex.calledOnceWith('str')).toBeTruthy();
			expect(ethUtilMock.asciiToHex.calledOnceWith('str')).toBeTruthy();
			expect(str).toEqual('hex');
		});
		it('does nothing if str is hex', () => {
			service.web3.utils = ethUtilMock;
			sinon.stub(ethUtilMock, 'isHex').returns(true);
			sinon.stub(ethUtilMock, 'asciiToHex').returns('hex');

			let str = service.ensureStrHex('str');
			expect(ethUtilMock.isHex.calledOnceWith('str')).toBeTruthy();
			expect(ethUtilMock.asciiToHex.calledOnceWith('str')).not.toBeTruthy();
			expect(str).toEqual('str');
		});
	});
	describe('ensureIntHex', () => {
		it('convers int to hex if int not hex', () => {
			service.web3.utils = ethUtilMock;
			sinon.stub(ethUtilMock, 'isHex').returns(false);
			sinon.stub(ethUtilMock, 'numberToHex').returns('hex');

			let str = service.ensureIntHex('str');
			expect(ethUtilMock.isHex.calledOnceWith('str')).toBeTruthy();
			expect(ethUtilMock.numberToHex.calledOnceWith('str')).toBeTruthy();
			expect(str).toEqual('hex');
		});
		it('does nothing if int is hex', () => {
			service.web3.utils = ethUtilMock;
			sinon.stub(ethUtilMock, 'isHex').returns(true);
			sinon.stub(ethUtilMock, 'numberToHex').returns('hex');

			let str = service.ensureIntHex('str');
			expect(ethUtilMock.isHex.calledOnceWith('str')).toBeTruthy();
			expect(ethUtilMock.numberToHex.calledOnceWith('str')).not.toBeTruthy();
			expect(str).toEqual('str');
		});
	});
	describe('checkTransactionStatus', () => {
		const t = (name, transaction, receipt, expectedStatus) =>
			it(name, async () => {
				service.web3.utils = ethUtilMock;
				let hash = 'test';
				sinon.stub(service, 'getTransaction').resolves(transaction);
				sinon.stub(service, 'getTransactionReceipt').resolves(receipt);

				let status = await service.checkTransactionStatus(hash);

				expect(status).toEqual(expectedStatus);
			});

		t('pending tx', null, null, 'pending');
		t('processing tx', { blockNumber: null }, null, 'processing');
		t('success tx', { blockNumber: 200 }, { status: '0x1' }, 'success');
		t('failed tx', { blockNumber: 200 }, { status: '0x0' }, 'failed');
	});
});
