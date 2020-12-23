import * as actions from './actions';
import * as types from './types';

describe('actions', () => {
	it('should create an action to update transaction', () => {
		const transaction = {
			address: 'dasdsadasasdsa',
			amount: 100,
			ethFee: 1,
			usdFee: 2,
			gasPrice: 1221,
			gasLimit: 21321,
			nonce: 11,
			signedHex: 'dasdas',
			transactionHash: 'dsadas',
			addressError: false,
			sending: false,
			cryptoCurrency: 'dasdsa'
		};

		const expectedAction = {
			type: types.TRANSACTION_UPDATE,
			payload: transaction
		};
		expect(actions.updateTransaction(transaction)).toEqual(expectedAction);
	});

	it('should create an action to update address error', () => {
		const error = true;
		const expectedAction = {
			type: types.ADDRESS_ERROR_UPDATE,
			payload: error
		};
		expect(actions.setAddressError(error)).toEqual(expectedAction);
	});
});
