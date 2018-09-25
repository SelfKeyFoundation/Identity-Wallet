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
			let wallet = { publicKey: 'test', privateKey: 'test', profile: 'local' };
			store.state.wallet = wallet;
			const args = { from: '0x' + wallet.publicKey };
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
			let wallet = { publicKey: 'test', privateKey: 'test', profile: 'test' };
			store.state.wallet = wallet;
			const args = { from: '0x' + wallet.publicKey };
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
});
