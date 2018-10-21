import reducer from './reducers';
import * as types from './types';

describe('address book reducer', () => {
	it('should return the initial state', () => {
		expect(reducer(undefined, {})).toEqual({
			entries: [],
			labelError: '',
			addressError: ''
		});
	});

	it('should handle ADD_ADDRESS_BOOK_ENTRY', () => {
		const entry = {
			id: 1,
			walletId: 1,
			label: 'test',
			address: '0x'
		};

		expect(
			reducer(undefined, {
				type: types.ADD_ADDRESS_BOOK_ENTRY,
				payload: entry
			})
		).toEqual({
			entries: [entry],
			labelError: '',
			addressError: ''
		});
	});

	it('should handle LOAD_ADDRESS_BOOK_ENTRIES', () => {
		const entries = [
			{
				id: 1,
				walletId: 1,
				label: 'test',
				address: '0x'
			},
			{
				id: 2,
				walletId: 2,
				label: 'test2',
				address: '0x2'
			}
		];

		expect(
			reducer(undefined, {
				type: types.LOAD_ADDRESS_BOOK_ENTRIES,
				payload: entries
			})
		).toEqual({
			entries: entries,
			labelError: '',
			addressError: ''
		});
	});

	it('should handle DELETE_ADDRESS_BOOK_ENTRY', () => {
		const entries = [
			{
				id: 1,
				walletId: 1,
				label: 'test',
				address: '0x'
			},
			{
				id: 2,
				walletId: 2,
				label: 'test2',
				address: '0x2'
			}
		];

		expect(
			reducer(
				{ entries, labelError: '', addressError: '' },
				{
					type: types.DELETE_ADDRESS_BOOK_ENTRY,
					payload: entries[0].id
				}
			)
		).toEqual({
			entries: [entries[1]],
			labelError: '',
			addressError: ''
		});
	});

	it('should handle SET_ADDRESS_BOOK_LABEL_ERROR', () => {
		expect(
			reducer(undefined, {
				type: types.SET_ADDRESS_BOOK_LABEL_ERROR,
				payload: 'Error'
			})
		).toEqual({
			entries: [],
			labelError: 'Error',
			addressError: ''
		});
	});

	it('should handle SET_ADDRESS_BOOK_ADDRESS_ERROR', () => {
		expect(
			reducer(undefined, {
				type: types.SET_ADDRESS_BOOK_ADDRESS_ERROR,
				payload: 'Error'
			})
		).toEqual({
			entries: [],
			labelError: '',
			addressError: 'Error'
		});
	});
});
