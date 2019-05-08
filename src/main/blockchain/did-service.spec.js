import DIDService from './did-service';
import { setGlobalContext } from 'common/context';

describe('DIDService', () => {
	let service = null;
	const ledger = {
		methods: {
			createDID: () => {
				return {
					send: () => {
						return { events: { CreatedDID: { returnValues: { id: 'id' } } } };
					},
					estimateGas: () => 1000
				};
			},
			getController: () => {
				return {
					call: () => 'controller'
				};
			}
		}
	};
	const web3Service = {
		web3: {
			eth: {
				Contract: () => ledger
			},
			utils: {
				hexToBytes: () => {}
			}
		}
	};
	setGlobalContext({ web3Service });

	beforeEach(() => {
		service = new DIDService();
	});

	it('createDID', async () => {
		const contractSpy = jest.spyOn(web3Service.web3.eth, 'Contract');
		const createDIDSpy = jest.spyOn(ledger.methods, 'createDID');
		const transaction = await service.createDID('walet');
		expect(contractSpy).toHaveBeenCalled();
		expect(createDIDSpy).toHaveBeenCalled();
		expect(transaction.events.CreatedDID.returnValues.id).toEqual('id');
	});

	it('getControllerAddress', async () => {
		const contractSpy = jest.spyOn(web3Service.web3.eth, 'Contract');
		const getControllerSpy = jest.spyOn(ledger.methods, 'getController');
		const controllerAddress = await service.getControllerAddress('did');
		expect(contractSpy).toHaveBeenCalled();
		expect(getControllerSpy).toHaveBeenCalled();
		expect(controllerAddress).toEqual('controller');
	});

	it('getGasLimit', async () => {
		const contractSpy = jest.spyOn(web3Service.web3.eth, 'Contract');
		const createDIDSpy = jest.spyOn(ledger.methods, 'createDID');
		const gasLimit = await service.getGasLimit('walet');
		expect(contractSpy).toHaveBeenCalled();
		expect(createDIDSpy).toHaveBeenCalled();
		expect(gasLimit).toEqual(1100);
	});
});
