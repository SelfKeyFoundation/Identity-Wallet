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
	Contract: ContractMock,
	method1() {
		return mockPromise;
	},
	method2() {
		return mockPromise;
	}
};

describe('Web3Service', () => {
	afterEach(() => {
		sinon.restore();
	});
	it('waitForTicket', async () => {
		let web3Service = new Web3Service();
		web3Service.ensureRequestInterval = cb => cb();
		web3Service.web3.eth = ethMock;

		let spy = sinon.spy(ethMock, 'method1');
		let res = await web3Service.waitForTicket({
			method: 'method1',
			args: []
		});
		expect(res).toBe('ok');
		expect(ethMock.method1.calledOnce).toBeTruthy();
		spy.restore();

		spy = sinon.spy(contractSubmethods, 'method1');
		res = await web3Service.waitForTicket({
			method: 'method1',
			contractAddress: '12345',
			contractMethod: 'contractMethod1',
			args: []
		});
		expect(res).toBe('ok');
		expect(contractSubmethods.method1.calledOnce).toBeTruthy();
	});
});
