import sinon from 'sinon';
import LeadgerService from './leadger-service';
import Web3 from 'web3';
const web3ServiceMock = {
	waitForTicket: () => {}
};

const mockWeb3 = {};

describe('LeadgerService', () => {
	let leadgerService;
	beforeEach(() => {
		leadgerService = new LeadgerService(web3ServiceMock);
	});
	afterEach(() => {
		sinon.restore();
	});
	it('createWeb3', () => {
		let web3 = leadgerService.createWeb3(0, 10);
		expect(web3 instanceof Web3).toBeTruthy();
	});
	it('signTransaction', async () => {
		let ticketStub = sinon.stub(web3ServiceMock, 'waitForTicket');
		let createWeb3Stub = sinon.stub(leadgerService, 'createWeb3');
		ticketStub.resolves('ok');
		createWeb3Stub.returns(mockWeb3);
		let transaction = await leadgerService.signTransaction({
			dataToSign: {},
			address: 'test_from'
		});
		expect(createWeb3Stub.calledOnce).toBeTruthy();
		expect(ticketStub.calledOnce).toBeTruthy();
		expect(ticketStub.getCall(0).args[0]).toEqual({
			method: 'signTransaction',
			args: [{ from: 'test_from' }],
			contractAddress: null,
			contractMethod: null,
			onceListenerName: null,
			customWeb3: mockWeb3
		});
		expect(transaction).toEqual('ok');
	});
	it('getAccounts', async () => {
		let ticketStub = sinon.stub(web3ServiceMock, 'waitForTicket');
		let createWeb3Stub = sinon.stub(leadgerService, 'createWeb3');
		ticketStub.resolves('ok');
		createWeb3Stub.returns(mockWeb3);
		let accounts = await leadgerService.getAccounts({});
		expect(createWeb3Stub.calledOnce).toBeTruthy();
		expect(ticketStub.calledOnce).toBeTruthy();
		expect(ticketStub.getCall(0).args[0]).toEqual({
			method: 'getAccounts',
			args: [],
			contractAddress: null,
			contractMethod: null,
			onceListenerName: null,
			customWeb3: mockWeb3
		});
		expect(accounts).toEqual('ok');
	});
});
