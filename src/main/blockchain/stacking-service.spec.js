import StackingService from './stacking-service';
import fetch from 'node-fetch';
jest.mock('node-fetch');

describe('StackingService', () => {
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

	let service = null;
	beforeEach(() => {
		service = new StackingService();
		fetch.mockResolvedValue({
			json() {
				return remoteConfig;
			}
		});
	});
	afterEach(() => {
		fetch.mockRestore();
	});
	it('acquireContract', async () => {
		await service.acquireContract();
		expect(service.activeContract).toEqual(parseContractAbi(activeContract));
		expect(service.deprecatedContracts).toEqual(deprecatedContracts.map(parseContractAbi));
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
});
