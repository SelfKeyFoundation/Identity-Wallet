import DepositService, {
	DepositContract,
	SelfKeyTokenContract,
	EtheriumContract
} from './deposit-service';
import fetch from 'node-fetch';
import sinon from 'sinon';

jest.mock('node-fetch');

const web3ServiceMock = {
	async waitForTicket(ticket) {},
	ensureStrHex(str) {
		return str;
	},
	ensureIntHex(num) {
		return num;
	}
};

const activeContract = {
	address: 'test_address',
	abi: '{"test":"test2"}'
};
const deprecatedContracts = [
	{ address: 'deprecated1', deprecated: true, abi: '{"test":"test2"}' },
	{ address: 'depracated2', deprecated: true, abi: '{"test":"test2"}' }
];
const remoteConfig = {
	entities: [{ data: activeContract }].concat(
		deprecatedContracts.map(contract => ({ data: contract }))
	)
};

const parseContractAbi = contract => ({ ...contract, abi: JSON.parse(contract.abi) });

describe('DepositService', () => {
	let service = null;
	beforeEach(() => {
		service = new DepositService({ web3Service: web3ServiceMock });
		fetch.mockResolvedValue({
			json() {
				return remoteConfig;
			}
		});
	});
	afterEach(() => {
		fetch.mockRestore();
		sinon.restore();
	});
	it('acquireContract', async () => {
		await service.acquireContract();
		expect(service.activeContract).toBeDefined();
		expect(service.activeContract.address).toEqual(activeContract.address);
		expect(service.deprecatedContracts).toBeDefined();
		expect(service.deprecatedContracts.length).toBe(2);
	});
	it('fetchConfig', async () => {
		let res = await service.fetchConfig();
		let expectedConfig = {
			activeContract: parseContractAbi(activeContract),
			deprecatedContracts: deprecatedContracts.map(parseContractAbi)
		};
		expect(res).toEqual(expectedConfig);
	});
	it('parseRemoteConfig', () => {
		let expectedConfig = {
			activeContract: parseContractAbi(activeContract),
			deprecatedContracts: deprecatedContracts.map(parseContractAbi)
		};
		expect(service.parseRemoteConfig(remoteConfig.entities)).toEqual(expectedConfig);
	});

	describe('getStakingInfo', () => {
		it('checks deprecatred contracts for stakes', async () => {
			sinon.stub(DepositContract.prototype, 'getBalance').resolves(0);
			await service.acquireContract();
			await service.getStakingInfo('test', 'test', 'test');
			expect(service.activeContract.getBalance.callCount).toBe(3);
		});
		it('checks gets release date for stakes', async () => {
			sinon.stub(DepositContract.prototype, 'getBalance').resolves(100);
			sinon.stub(DepositContract.prototype, 'getReleaseDate').resolves(0);
			await service.acquireContract();
			await service.getStakingInfo('test', 'test', 'test');
			expect(service.activeContract.getReleaseDate.callCount).toBe(1);
		});
	});
	it('placeStake', async () => {
		await service.acquireContract();
		sinon.stub(service.activeContract, 'deposit');
		sinon.stub(service.tokenContract, 'approve').resolves('1000');
		sinon.stub(service.tokenContract, 'allowance').resolves(0);
		await service.placeStake('test', 100, 'test', 'test');
		expect(service.activeContract.deposit.calledOnce).toBeTruthy();
		expect(service.tokenContract.approve).toBeTruthy();
	});
	it('withdrawStake', async () => {
		await service.acquireContract();
		sinon.stub(Date, 'now').returns(11);
		let info = { contract: { withdraw: sinon.stub().resolves('test') }, releaseDate: 10 };
		sinon.stub(service, 'getStakingInfo').resolves(info);

		await service.withdrawStake('test', 'test', 'test');
		expect(service.getStakingInfo.calledOnce).toBeTruthy();
		expect(info.contract.withdraw.calledOnce).toBeTruthy();

		Date.now.returns(9);
		try {
			await service.withdrawStake('test', 'test', 'test');
		} catch (error) {
			expect(error).toBeTruthy();
		}

		info.contract = null;
		Date.now.returns(11);
		try {
			await service.withdrawStake('test', 'test', 'test');
		} catch (error) {
			expect(error).toBeTruthy();
		}
	});
});

describe('Contract', () => {
	let contract = null;
	const contractAddress = 'test';
	const contractAbi = [{ test: 'test' }];
	const sourceAddress = 'test';
	const testArg1 = 1;
	const testArg2 = 2;

	beforeEach(() => {
		contract = new EtheriumContract(web3ServiceMock, contractAddress, contractAbi);
	});
	afterEach(() => {
		sinon.restore();
	});
	it('call', async () => {
		sinon.stub(web3ServiceMock, 'waitForTicket').resolves(10);
		const options = { from: sourceAddress, testOpt: 'test' };
		let res = await contract.call({
			options,
			args: [testArg1, testArg2],
			method: 'test'
		});
		expect(web3ServiceMock.waitForTicket.calledOnce).toBeTruthy();
		expect(web3ServiceMock.waitForTicket.getCall(0).args[0]).toEqual({
			method: 'call',
			contractMethodArgs: [testArg1, testArg2],
			contractAddress: contract.address,
			contractMethod: 'test',
			customAbi: contract.abi,
			args: [options]
		});
		expect(res).toEqual({ res: 10, contract: contract.address });
	});
	it('send', async () => {
		sinon.stub(web3ServiceMock, 'waitForTicket').resolves(10);
		const options = { from: sourceAddress, testOpt: 'test', method: 'send' };
		let res = await contract.send({
			args: [testArg1, testArg2],
			options,
			method: 'test'
		});
		expect(web3ServiceMock.waitForTicket.calledOnce).toBeTruthy();
		expect(web3ServiceMock.waitForTicket.getCall(0).args[0]).toEqual({
			method: 'send',
			contractMethodArgs: [testArg1, testArg2],
			contractAddress: contract.address,
			contractMethod: 'test',
			customAbi: contract.abi,
			onceListenerName: 'transactionHash',
			args: [options]
		});
		expect(res).toEqual({ hash: 10, contract: contract.address });
	});
	it('estimateGas', async () => {
		sinon.stub(web3ServiceMock, 'waitForTicket').resolves(10);
		const options = { from: sourceAddress, testOpt: 'test', method: 'estimateGas' };
		let res = await contract.send({
			args: [testArg1, testArg2],
			options,
			method: 'test'
		});
		expect(res).toEqual({ gas: 100000, contract: contract.address });
		// expect(web3ServiceMock.waitForTicket.calledOnce).toBeTruthy();
		// expect(web3ServiceMock.waitForTicket.getCall(0).args[0]).toEqual({
		// 	method: 'estimateGas',
		// 	contractMethodArgs: [testArg1, testArg2],
		// 	contractAddress: contract.address,
		// 	contractMethod: 'test',
		// 	customAbi: contract.abi,
		// 	onceListenerName: null,
		// 	args: [options]
		// });
		// expect(res).toBe(10);
	});
});

describe('DepositContract', () => {
	let contract = null;
	const testDepositor = 'test';
	const testServiceOwner = 'owner';
	const testServiceID = 'testId';

	beforeEach(() => {
		contract = new DepositContract(
			web3ServiceMock,
			activeContract.address,
			activeContract.abi,
			activeContract.deprecated
		);
	});
	afterEach(() => {
		sinon.restore();
	});
	it('getBalance', async () => {
		sinon.stub(contract, 'call').resolves({ res: 0 });
		const options = { from: testDepositor };
		await contract.getBalance(testServiceOwner, testServiceID, options);
		expect(contract.call.calledOnce).toBeTruthy();
		expect(contract.call.getCall(0).args[0]).toEqual({
			args: [testDepositor, testServiceOwner, testServiceID],
			method: 'balances',
			options
		});
	});
	it('deposit', async () => {
		sinon.stub(contract, 'send').resolves({ res: 0 });
		const options = { from: testDepositor, method: 'send' };
		await contract.deposit(10, testServiceOwner, testServiceID, options);
		expect(contract.send.calledOnce).toBeTruthy();
		expect(contract.send.getCall(0).args[0]).toEqual({
			options,
			args: [10, testServiceOwner, testServiceID],
			method: 'deposit'
		});
	});
	it('withdraw', async () => {
		sinon.stub(contract, 'send').resolves({ res: 0 });
		const options = { from: testDepositor, method: 'send' };
		await contract.withdraw(testServiceOwner, testServiceID, options);
		expect(contract.send.calledOnce).toBeTruthy();
		expect(contract.send.getCall(0).args[0]).toEqual({
			options,
			args: [testServiceOwner, testServiceID],
			method: 'withdraw'
		});
	});
	it('getReleaseDate', async () => {
		sinon.stub(contract, 'call').resolves({ res: 0 });
		const options = { from: testDepositor };
		await contract.getReleaseDate(testServiceOwner, testServiceID, options);
		expect(contract.call.calledOnce).toBeTruthy();
		expect(contract.call.getCall(0).args[0]).toEqual({
			options,
			args: [testDepositor, testServiceOwner, testServiceID],
			method: 'releaseDates'
		});
	});
	it('getLockPeriud', async () => {
		sinon.stub(contract, 'call').resolves({ res: 0 });
		const options = { from: testDepositor };
		await contract.getLockPeriod(testServiceOwner, testServiceID, options);
		expect(contract.call.calledOnce).toBeTruthy();
		expect(contract.call.getCall(0).args[0]).toEqual({
			options,
			args: [testServiceOwner, testServiceID],
			method: 'lockPeriods'
		});
	});
});

describe('SelfKeyTokenContract', () => {
	let contract = null;
	const tokenAddress = 'test';
	const selfKeyTokenAbi = [{ test: 'test' }];
	const testDepositor = 'test';
	const depositVaultAddress = 'owner';

	beforeEach(() => {
		contract = new SelfKeyTokenContract(web3ServiceMock, tokenAddress, selfKeyTokenAbi);
	});
	afterEach(() => {
		sinon.restore();
	});
	it('approve', async () => {
		sinon.stub(contract, 'send').resolves({ res: 0 });
		const options = { from: testDepositor, method: 'send' };
		await contract.approve(depositVaultAddress, 200, options);
		expect(contract.send.calledOnce).toBeTruthy();
		expect(contract.send.getCall(0).args[0]).toEqual({
			options,
			args: [depositVaultAddress, 200],
			method: 'approve'
		});
	});
	it('allowance', async () => {
		sinon.stub(contract, 'call').resolves({ res: 0 });
		const options = { from: testDepositor };
		await contract.allowance(depositVaultAddress, options);
		expect(contract.call.calledOnce).toBeTruthy();
		expect(contract.call.getCall(0).args[0]).toEqual({
			options,
			args: [options.from, depositVaultAddress],
			method: 'allowance'
		});
	});
});
