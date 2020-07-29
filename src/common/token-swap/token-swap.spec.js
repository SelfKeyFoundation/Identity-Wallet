import {
	tokenSwapActions,
	tokenSwapTypes,
	initialState,
	tokenSwapReducers,
	tokenSwapSelectors
} from './index';
// import sinon from 'sinon';
import BN from 'bignumber.js';

const toUnit = (amount, decimals) => new BN(amount).div(new BN(10).pow(decimals)).toString(10);

const tokensFixture = [
	{
		name: 'Student Coin',
		symbol: 'STU',
		address: '0x0371a82e4a9d0a4312f3ee2ac9c6958512891372',
		decimals: 18,
		tradable: false,
		iconUrl: 'https://s3.amazonaws.com/totle-token-icons/STU-icon.png'
	}
];

const transactionFixture = {
	id: '0xe9d40d92483844bd8a1edb3d789f38121f32f676e932422d8e371de9e6ddf92e',
	summary: [
		{
			market: {
				rate: '169053.25775264839316366',
				slippage: '0%'
			},
			partnerFee: {
				percentage: '0',
				amount: '10'
			},
			totleFee: {
				percentage: '0',
				amount: '20'
			}
		}
	],
	transactions: [
		{
			type: 'tx',
			tx: {
				to: '0x77208a6000691e440026bed1b178ef4661d37426',
				from: '0x0000000000000000000000000000000000000000',
				value: '1',
				data:
					'0x5f10dffc000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000...',
				gasPrice: '10000000000',
				gas: '2750000',
				nonce: '0'
			}
		}
	],
	expiration: {
		blockNumber: 9728835,
		estimatedTimestamp: 1584981981
	}
};

describe('token-swap', () => {
	describe('actions', () => {
		it('setTokens', () => {
			const payload = tokensFixture;

			expect(tokenSwapActions.setTokens(payload)).toEqual({
				type: tokenSwapTypes.TOKEN_SWAP_TOKENS_SET,
				payload: [
					{
						name: 'Student Coin',
						symbol: 'STU',
						address: '0x0371a82e4a9d0a4312f3ee2ac9c6958512891372',
						decimals: 18,
						tradable: false,
						iconUrl: 'https://s3.amazonaws.com/totle-token-icons/STU-icon.png'
					}
				]
			});
		});

		it('setSource', () => {
			const payload = 'ETH';

			expect(tokenSwapActions.setSource(payload)).toEqual({
				type: tokenSwapTypes.TOKEN_SWAP_SOURCE_SET,
				payload: 'ETH'
			});
		});

		it('setTarget', () => {
			const payload = 'KEY';

			expect(tokenSwapActions.setTarget(payload)).toEqual({
				type: tokenSwapTypes.TOKEN_SWAP_TARGET_SET,
				payload: 'KEY'
			});
		});

		it('setLoading', () => {
			const payload = true;

			expect(tokenSwapActions.setLoading(payload)).toEqual({
				type: tokenSwapTypes.TOKEN_SWAP_LOADING_SET,
				payload: true
			});
		});

		it('setError', () => {
			const payload = 'error message';

			expect(tokenSwapActions.setError(payload)).toEqual({
				type: tokenSwapTypes.TOKEN_SWAP_ERROR_SET,
				payload: 'error message'
			});
		});

		it('setTransaction', () => {
			const payload = transactionFixture;

			expect(tokenSwapActions.setError(payload)).toEqual({
				type: tokenSwapTypes.TOKEN_SWAP_ERROR_SET,
				payload: {
					id: '0xe9d40d92483844bd8a1edb3d789f38121f32f676e932422d8e371de9e6ddf92e',
					summary: [
						{
							market: {
								rate: '169053.25775264839316366',
								slippage: '0%'
							},
							partnerFee: {
								percentage: '0',
								amount: '10'
							},
							totleFee: {
								percentage: '0',
								amount: '20'
							}
						}
					],
					transactions: [
						{
							type: 'tx',
							tx: {
								to: '0x77208a6000691e440026bed1b178ef4661d37426',
								from: '0x0000000000000000000000000000000000000000',
								value: '1',
								data:
									'0x5f10dffc000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000...',
								gasPrice: '10000000000',
								gas: '2750000',
								nonce: '0'
							}
						}
					],
					expiration: {
						blockNumber: 9728835,
						estimatedTimestamp: 1584981981
					}
				}
			});
		});
	});

	describe('reducers', () => {
		it('setTokensReducer', () => {
			const state = { ...initialState };
			const tokens = tokensFixture;
			const action = tokenSwapActions.setTokens(tokens);

			expect(state.tokens).toEqual([]);
			expect(tokenSwapReducers.setTokensReducer(state, action)).toEqual({
				...state,
				tokens
			});
		});

		it('setTransactionReducer', () => {
			const state = { ...initialState };
			const transaction = transactionFixture;
			const action = tokenSwapActions.setTransaction(transaction);

			expect(state.transaction).toEqual(false);
			expect(tokenSwapReducers.setTransactionReducer(state, action)).toEqual({
				...state,
				transaction
			});
		});

		it('setErrorReducer', () => {
			const state = { ...initialState };
			const error = 'error message';
			const action = tokenSwapActions.setError(error);

			expect(state.error).toEqual(false);
			expect(tokenSwapReducers.setErrorReducer(state, action)).toEqual({
				...state,
				error
			});
		});

		it('setSourceReducer', () => {
			const state = { ...initialState };
			const source = 'ETH';
			const action = tokenSwapActions.setSource(source);

			expect(state.source).toEqual('');
			expect(tokenSwapReducers.setSourceReducer(state, action)).toEqual({
				...state,
				source
			});
		});

		it('setTargetReducer', () => {
			const state = { ...initialState };
			const target = 'KEY';
			const action = tokenSwapActions.setTarget(target);

			expect(state.target).toEqual('');
			expect(tokenSwapReducers.setTargetReducer(state, action)).toEqual({
				...state,
				target
			});
		});

		it('setLoadingReducer', () => {
			const state = { ...initialState };
			const loading = true;
			const action = tokenSwapActions.setLoading(loading);

			expect(state.loading).toEqual(false);
			expect(tokenSwapReducers.setLoadingReducer(state, action)).toEqual({
				...state,
				loading
			});
		});
	});

	describe('selectors', () => {
		let state;
		beforeEach(() => {
			state = { tokenSwap: { ...initialState } };
		});

		it('selectRoot', () => {
			expect(tokenSwapSelectors.selectRoot(state)).toEqual(initialState);
		});

		it('selectTokens', () => {
			expect(tokenSwapSelectors.selectTokens(state)).toEqual(initialState.tokens);
			const action = tokenSwapActions.setTokens(tokensFixture);
			state.tokenSwap = tokenSwapReducers.setTokensReducer(state, action);
			expect(tokenSwapSelectors.selectTokens(state)).toEqual(tokensFixture);
		});
		it('selectSource', () => {
			expect(tokenSwapSelectors.selectSource(state)).toEqual(initialState.source);
			const action = tokenSwapActions.setSource('ETH');
			state.tokenSwap = tokenSwapReducers.setSourceReducer(state, action);
			expect(tokenSwapSelectors.selectSource(state)).toEqual('ETH');
		});
		it('selectTarget', () => {
			expect(tokenSwapSelectors.selectTarget(state)).toEqual(initialState.target);
			const action = tokenSwapActions.setTarget('KEY');
			state.tokenSwap = tokenSwapReducers.setTargetReducer(state, action);
			expect(tokenSwapSelectors.selectTarget(state)).toEqual('KEY');
		});
		it('selectError', () => {
			expect(tokenSwapSelectors.selectError(state)).toEqual(initialState.error);
			const action = tokenSwapActions.setError('error message');
			state.tokenSwap = tokenSwapReducers.setErrorReducer(state, action);
			expect(tokenSwapSelectors.selectError(state)).toEqual('error message');
		});
		it('selectLoading', () => {
			expect(tokenSwapSelectors.selectLoading(state)).toEqual(initialState.loading);
			const action = tokenSwapActions.setLoading(true);
			state.tokenSwap = tokenSwapReducers.setLoadingReducer(state, action);
			expect(tokenSwapSelectors.selectLoading(state)).toEqual(true);
		});
		it('selectTransaction', () => {
			expect(tokenSwapSelectors.selectTransaction(state)).toEqual(initialState.transaction);
			const action = tokenSwapActions.setTransaction(transactionFixture);
			state.tokenSwap = tokenSwapReducers.setTransactionReducer(state, action);
			expect(tokenSwapSelectors.selectTransaction(state)).toEqual(transactionFixture);
		});
		it('selectFee', () => {
			expect(tokenSwapSelectors.selectFee(state)).toEqual(initialState.fee);
			const action = tokenSwapActions.setTransaction(transactionFixture);
			state.tokenSwap = tokenSwapReducers.setTransactionReducer(state, action);
			// 30 Wei to Ether
			expect(tokenSwapSelectors.selectFee(state)).toEqual('0.00000000000000003');
		});
		it('selectGas', () => {
			expect(tokenSwapSelectors.selectGas(state)).toEqual(initialState.gas);
			const action = tokenSwapActions.setTransaction(transactionFixture);
			state.tokenSwap = tokenSwapReducers.setTransactionReducer(state, action);
			const gas =
				transactionFixture.transactions[0].tx.gas *
				transactionFixture.transactions[0].tx.gasPrice;
			expect(tokenSwapSelectors.selectGas(state)).toEqual(toUnit(gas, 18));
		});
		it('selectRate', () => {
			expect(tokenSwapSelectors.selectGas(state)).toEqual(initialState.rate);
			const action = tokenSwapActions.setTransaction(transactionFixture);
			state.tokenSwap = tokenSwapReducers.setTransactionReducer(state, action);
			expect(tokenSwapSelectors.selectRate(state)).toEqual('169053.25775264839316366');
		});
	});
});
