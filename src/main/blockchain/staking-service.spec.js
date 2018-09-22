import StakingService, {
	StakingContract,
	SelfKeyTokenContract,
	EtheriumContract
} from './staking-service';
import fetch from 'node-fetch';
import sinon from 'sinon';

jest.mock('node-fetch');

const web3ServiceMock = {
	async waitForTicket(ticket) {}
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

describe('StackingService', () => {
	let service = null;
	beforeEach(() => {
		service = new StakingService({ web3Service: web3ServiceMock });
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
			sinon.stub(StakingContract.prototype, 'getBalance').resolves(0);
			await service.acquireContract();
			await service.getStakingInfo('test', 'test', 'test');
			expect(service.activeContract.getBalance.callCount).toBe(3);
		});
		it('checks gets release date for stakes', async () => {
			sinon.stub(StakingContract.prototype, 'getBalance').resolves(100);
			sinon.stub(StakingContract.prototype, 'getReleaseDate').resolves(0);
			await service.acquireContract();
			await service.getStakingInfo('test', 'test', 'test');
			expect(service.activeContract.getReleaseDate.callCount).toBe(1);
		});
	});
	it('placeStake', async () => {
		await service.acquireContract();
		sinon.stub(service.activeContract, 'deposit');
		sinon.stub(service.tokenContract, 'approve');
		await service.placeStake('test', 100, 'test', 'test');
		expect(service.activeContract.deposit.calledOnce).toBeTruthy();
		expect(service.tokenContract.approve).toBeTruthy();
	});
	it('withdrawStake', async () => {
		await service.acquireContract();
		let info = { contract: { withdraw: sinon.stub().resolves('test') } };
		sinon.stub(service, 'getStakingInfo').resolves(info);

		await service.withdrawStake('test', 'test', 'test');
		expect(service.getStakingInfo.calledOnce).toBeTruthy();
		expect(info.contract.withdraw.calledOnce).toBeTruthy();
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

		let res = await contract.call({
			from: sourceAddress,
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
			args: [{ from: sourceAddress }]
		});
		expect(res).toBe(10);
	});
	it('send', async () => {
		sinon.stub(web3ServiceMock, 'waitForTicket').resolves(10);

		let res = await contract.send({
			from: sourceAddress,
			args: [testArg1, testArg2],
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
			args: [{ from: sourceAddress }]
		});
		expect(res).toBe(10);
	});
});

describe('StakingContract', () => {
	let contract = null;
	const testDepositor = 'test';
	const testServiceOwner = 'owner';
	const testServiceID = 'testId';

	beforeEach(() => {
		contract = new StakingContract(
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
		sinon.stub(contract, 'call');

		await contract.getBalance(testDepositor, testServiceOwner, testServiceID);
		expect(contract.call.calledOnce).toBeTruthy();
		expect(contract.call.getCall(0).args[0]).toEqual({
			from: testDepositor,
			args: [testDepositor, testServiceOwner, testServiceID],
			method: 'balances'
		});
	});
	it('deposit', async () => {
		sinon.stub(contract, 'send');

		await contract.deposit(testDepositor, 10, testServiceOwner, testServiceID);
		expect(contract.send.calledOnce).toBeTruthy();
		expect(contract.send.getCall(0).args[0]).toEqual({
			from: testDepositor,
			args: [10, testServiceOwner, testServiceID],
			method: 'deposit'
		});
	});
	it('withdraw', async () => {
		sinon.stub(contract, 'send');

		await contract.withdraw(testDepositor, testServiceOwner, testServiceID);
		expect(contract.send.calledOnce).toBeTruthy();
		expect(contract.send.getCall(0).args[0]).toEqual({
			from: testDepositor,
			args: [testServiceOwner, testServiceID],
			method: 'withdraw'
		});
	});
	it('getReleaseDate', async () => {
		sinon.stub(contract, 'call');

		await contract.getReleaseDate(testDepositor, testServiceOwner, testServiceID);
		expect(contract.call.calledOnce).toBeTruthy();
		expect(contract.call.getCall(0).args[0]).toEqual({
			from: testDepositor,
			args: [testDepositor, testServiceOwner, testServiceID],
			method: 'releaseDates'
		});
	});
	it('getLockPeriud', async () => {
		sinon.stub(contract, 'call');

		await contract.getLockPeriod(testDepositor, testServiceOwner, testServiceID);
		expect(contract.call.calledOnce).toBeTruthy();
		expect(contract.call.getCall(0).args[0]).toEqual({
			from: testDepositor,
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
		sinon.stub(contract, 'send');
		await contract.approve(testDepositor, depositVaultAddress, 200);
		expect(contract.send.calledOnce).toBeTruthy();
		expect(contract.send.getCall(0).args[0]).toEqual({
			from: testDepositor,
			args: [depositVaultAddress, 200],
			method: 'approve'
		});
	});
});
