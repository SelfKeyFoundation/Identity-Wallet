import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { setGlobalContext } from 'common/context';
import operations, {
	setLocked,
	setTransactionFee,
	getGasLimit,
	DEFAULT_ETH_GAS_LIMIT
} from './operations';

import * as actions from './actions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const getStoreMock = (transaction = {}) =>
	mockStore({
		transaction: {
			address: '',
			amount: 0,
			ethFee: 0,
			usdFee: 0,
			gasPrice: 0,
			gasLimit: 0,
			nonce: 0,
			signedHex: '',
			transactionHash: '',
			addressError: false,
			sending: false,
			cryptoCurrency: undefined,
			...transaction
		},
		prices: {
			prices: [
				{
					id: 1,
					name: 'Selfkey',
					priceBTC: 1,
					priceETH: 31.288316997525087,
					priceUSD: 6513.00400614,
					source: 'https://coincap.io',
					symbol: 'KEY'
				},
				{
					id: 2,
					name: 'Ethereum',
					priceBTC: 1,
					priceETH: 31.288316997525087,
					priceUSD: 6513.00400614,
					source: 'https://coincap.io',
					symbol: 'ETH'
				}
			]
		},
		wallet: {
			address: 'dasdsa'
		},
		walletTokens: {
			tokens: []
		},
		ethGasStationInfo: {
			ethGasStationInfo: {
				average: 123,
				medium: {
					suggestedMaxFeePerGas: 4
				}
			}
		}
	});

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

	describe('getGasLimit', () => {
		const gasLimitMock = Math.random();
		const address = `${Math.random()}`;
		const amount = Math.random();
		const walletAddress = `${Math.random()}`;
		const nonce = 1;
		const tokenContract = `${Math.random()}`;

		it('should call  token service to calculate gas limit', async () => {
			setGlobalContext({
				tokenService: {
					getGasLimit() {
						return gasLimitMock;
					}
				}
			});

			const result = await getGasLimit(
				'KEY',
				address,
				amount,
				18,
				walletAddress,
				nonce,
				tokenContract
			);

			expect(result).toEqual(gasLimitMock);
		});

		it('should return eth gas limit', async () => {
			setGlobalContext({
				walletService: {
					estimateGas() {
						return DEFAULT_ETH_GAS_LIMIT;
					}
				}
			});
			const result = await getGasLimit(
				'ETH',
				address,
				amount,
				18,
				walletAddress,
				nonce,
				tokenContract
			);

			expect(result).toEqual(DEFAULT_ETH_GAS_LIMIT);
		});
	});

	describe('setTransactionFee', () => {
		const MOCK_GAST_LIMIT = 123;
		let context;

		beforeEach(() => {
			context = {
				web3Service: {
					web3: {
						utils: {
							toChecksumAddress: jest.fn(),
							isAddress: () => {
								return true;
							},
							isHex: () => {
								return true;
							},
							fromWei: () => 1
						}
					},
					waitForTicket: () => 1
				},
				tokenService: {
					getGasLimit: jest.fn(() => MOCK_GAST_LIMIT)
				}
			};
			setGlobalContext(context);
		});

		it('should lock and unlock transaction', async () => {
			const store = getStoreMock({
				cryptoCurrency: 'ETH'
			});
			const newAddress = ``;
			const newAmount = null;
			const newGasPrice = null;
			const newGasLimit = null;
			const dispatch = jest.fn();
			await setTransactionFee(newAddress, newAmount, newGasPrice, newGasLimit)(dispatch, () =>
				store.getState()
			);
			expect(dispatch).toBeCalledWith(setLocked(true));
			expect(dispatch).toHaveBeenLastCalledWith(setLocked(false));
		});

		it('should calculate ethFee, gasPrice and gasLimit', async () => {
			const store = getStoreMock({
				cryptoCurrency: 'KEY'
			});
			const newAddress = `${Math.random()}`;
			const newAmount = 2;
			const newGasPrice = null;
			const newGasLimit = null;
			const dispatch = jest.fn();
			await setTransactionFee(newAddress, newAmount, newGasPrice, newGasLimit)(dispatch, () =>
				store.getState()
			);

			expect(dispatch).toBeCalledWith(
				actions.updateTransaction({
					ethFee: 1,
					gasPrice: 4,
					gasLimit: MOCK_GAST_LIMIT,
					gasLimitUpdated: undefined,
					maxPriorityFee: store.getState().ethGasStationInfo.ethGasStationInfo.medium
						.suggestedMaxFeePerGas,
					nonce: 1
				})
			);
		});

		it('should calculate gasLimit when gasPrice is udpated', async () => {
			const store = getStoreMock({
				cryptoCurrency: 'KEY',
				address: `${Math.random()}`,
				amount: 1
			});
			const newAddress = null;
			const newAmount = null;
			const newGasPrice = 22;
			const newGasLimit = null;
			const dispatch = jest.fn();
			await setTransactionFee(newAddress, newAmount, newGasPrice, newGasLimit)(dispatch, () =>
				store.getState()
			);

			expect(dispatch).toBeCalledWith(
				actions.updateTransaction({
					ethFee: 1,
					gasPrice: newGasPrice,
					gasLimit: MOCK_GAST_LIMIT,
					gasLimitUpdated: undefined,
					maxPriorityFee: store.getState().ethGasStationInfo.ethGasStationInfo.medium
						.suggestedMaxFeePerGas,
					nonce: 1
				})
			);

			expect(context.tokenService.getGasLimit).toBeCalled();
		});

		it('should calculate gasLimit when this is undefined and user set the transaction amount', async () => {
			const store = getStoreMock({
				cryptoCurrency: 'KEY',
				address: `${Math.random()}`
			});

			const newAddress = null;
			const newAmount = 1;
			const newGasPrice = null;
			const newGasLimit = null;
			const dispatch = jest.fn();
			await setTransactionFee(newAddress, newAmount, newGasPrice, newGasLimit)(dispatch, () =>
				store.getState()
			);

			expect(dispatch).toBeCalledWith(
				actions.updateTransaction({
					ethFee: 1,
					gasPrice: store.getState().ethGasStationInfo.ethGasStationInfo.medium
						.suggestedMaxFeePerGas,
					maxPriorityFee: store.getState().ethGasStationInfo.ethGasStationInfo.medium
						.suggestedMaxFeePerGas,
					gasLimit: MOCK_GAST_LIMIT,
					gasLimitUpdated: undefined,
					nonce: 1
				})
			);

			expect(context.tokenService.getGasLimit).toBeCalled();
		});

		it('should NOT calculate gasLimit when gasPrice is udpated and gasLimit was setup manually', async () => {
			const manualGasLimit = Math.random();
			const store = getStoreMock({
				cryptoCurrency: 'KEY',
				address: `${Math.random()}`,
				amount: 1,
				gasLimitUpdated: true,
				gasLimit: manualGasLimit
			});

			const newAddress = null;
			const newAmount = null;
			const newGasPrice = 22;
			const newGasLimit = null;
			const dispatch = jest.fn();
			await setTransactionFee(newAddress, newAmount, newGasPrice, newGasLimit)(dispatch, () =>
				store.getState()
			);

			expect(dispatch).toBeCalledWith(
				actions.updateTransaction({
					ethFee: 1,
					gasPrice: newGasPrice,
					gasLimit: manualGasLimit,
					maxPriorityFee: store.getState().ethGasStationInfo.ethGasStationInfo.medium
						.suggestedMaxFeePerGas,
					gasLimitUpdated: true,
					nonce: 1
				})
			);

			expect(context.tokenService.getGasLimit).toBeCalledTimes(0);
		});
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
				nonce: 0,
				signedHex: '',
				transactionHash: '',
				addressError: false,
				sending: false,
				cryptoCurrency: undefined
			},
			wallet: {
				address: 'dasdsa'
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
				nonce: 0,
				signedHex: '',
				transactionHash: '',
				addressError: false,
				sending: false,
				cryptoCurrency: undefined
			},
			wallet: {
				address: 'dasdsa'
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
				nonce: 0,
				signedHex: '',
				transactionHash: '',
				addressError: false,
				sending: false,
				cryptoCurrency: undefined
			},
			wallet: {
				address: 'dasdsa'
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
