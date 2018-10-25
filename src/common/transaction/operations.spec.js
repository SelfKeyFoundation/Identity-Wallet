import operations from './operations';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { setGlobalContext } from 'common/context';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('operations', () => {
	it('should call updateTransaction action', async () => {
		const store = mockStore({});

		const extraParams = {
			trezorAccountIndex: 0,
			cryptoCurrency: 'ETH'
		};
		const expectedActions = [
			{
				meta: { trigger: 'app/transaction/init' },
				payload: [{ cryptoCurrency: 'ETH', trezorAccountIndex: 0 }],
				type: 'ALIASED'
			}
		];

		await store.dispatch(operations.init(extraParams));
		expect(store.getActions()).toEqual(expectedActions);
	});

	it('should call setAddress without error if address is valid', async () => {
		const ctx = {
			web3Service: {
				web3: {
					utils: {
						toChecksumAddress: jest.fn(),
						isAddress: () => {
							return true;
						},
						isHex: () => {
							return true;
						}
					}
				}
			}
		};
		setGlobalContext(ctx);

		const store = mockStore({
			transaction: {
				address: '',
				amount: 0,
				ethFee: 0,
				usdFee: 0,
				gasPrice: 0,
				gasLimit: 0,
				nouce: 0,
				signedHex: '',
				transactionHash: '',
				addressError: false,
				sending: false,
				cryptoCurrency: undefined
			},
			wallet: {
				publicKey: 'dasdsa'
			},
			ethGasStationInfo: {
				ethGasStationInfo: {
					average: 123
				}
			}
		});

		const expectedActions = [
			{
				meta: { trigger: 'app/transaction/address/SET' },
				payload: ['0xd0d99d16dbeae0be07e0bbaa5d715bf17ac4f0c8'],
				type: 'ALIASED'
			}
		];

		await store.dispatch(operations.setAddress('0xd0d99d16dbeae0be07e0bbaa5d715bf17ac4f0c8'));
		expect(store.getActions()).toEqual(expectedActions);
	});

	it('should call setAddress with error if address is not a address', async () => {
		const ctx = {
			web3Service: {
				web3: {
					utils: {
						toChecksumAddress: jest.fn(),
						isAddress: () => {
							return false;
						},
						isHex: () => {
							return true;
						}
					}
				}
			}
		};
		setGlobalContext(ctx);

		const store = mockStore({
			transaction: {
				address: '',
				amount: 0,
				ethFee: 0,
				usdFee: 0,
				gasPrice: 0,
				gasLimit: 0,
				nouce: 0,
				signedHex: '',
				transactionHash: '',
				addressError: false,
				sending: false,
				cryptoCurrency: undefined
			},
			wallet: {
				publicKey: 'dasdsa'
			},
			ethGasStationInfo: {
				ethGasStationInfo: {
					average: 123
				}
			}
		});
		const address = 'dadsa';
		const expectedActions = [
			{
				meta: { trigger: 'app/transaction/address/SET' },
				payload: [address],
				type: 'ALIASED'
			}
		];

		await store.dispatch(operations.setAddress(address));
		expect(store.getActions()).toEqual(expectedActions);
	});

	it('should call setAddress with error if address is not a hex', async () => {
		const ctx = {
			web3Service: {
				web3: {
					utils: {
						toChecksumAddress: jest.fn(),
						isAddress: () => {
							return true;
						},
						isHex: () => {
							return false;
						}
					}
				}
			}
		};
		setGlobalContext(ctx);

		const store = mockStore({
			transaction: {
				address: '',
				amount: 0,
				ethFee: 0,
				usdFee: 0,
				gasPrice: 0,
				gasLimit: 0,
				nouce: 0,
				signedHex: '',
				transactionHash: '',
				addressError: false,
				sending: false,
				cryptoCurrency: undefined
			},
			wallet: {
				publicKey: 'dasdsa'
			},
			ethGasStationInfo: {
				ethGasStationInfo: {
					average: 123
				}
			}
		});

		const address = 'dadsa';
		const expectedActions = [
			{
				meta: { trigger: 'app/transaction/address/SET' },
				payload: [address],
				type: 'ALIASED'
			}
		];

		await store.dispatch(operations.setAddress(address));
		expect(store.getActions()).toEqual(expectedActions);
	});
});
