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

	it('should handle ADRESS_BOOK_ENTRY_ADD', () => {
		const entry = {
			id: 1,
			walletId: 1,
			label: 'test',
			address: '0x'
		};

		expect(
			reducer(undefined, {
				type: types.ADRESS_BOOK_ENTRY_ADD,
				payload: entry
			})
		).toEqual({
			entries: [entry],
			labelError: '',
			addressError: ''
		});
	});

	it('should handle ADDRESS_BOOK_ENTRIES_LOAD', () => {
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
				type: types.ADDRESS_BOOK_ENTRIES_LOAD,
				payload: entries
			})
		).toEqual({
			entries: entries,
			labelError: '',
			addressError: ''
		});
	});

	it('should handle ADDRESS_BOOK_ENTRY_DELETE', () => {
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
					type: types.ADDRESS_BOOK_ENTRY_DELETE,
					payload: entries[0].id
				}
			)
		).toEqual({
			entries: [entries[1]],
			labelError: '',
			addressError: ''
		});
	});

	it('should handle ADDRESS_BOOK_LABEL_ERROR_SET', () => {
		expect(
			reducer(undefined, {
				type: types.ADDRESS_BOOK_LABEL_ERROR_SET,
				payload: 'Error'
			})
		).toEqual({
			entries: [],
			labelError: 'Error',
			addressError: ''
		});
	});

	it('should handle ADDRESS_BOOK_ADDRESS_ERROR_SET', () => {
		expect(
			reducer(undefined, {
				type: types.ADDRESS_BOOK_ADDRESS_ERROR_SET,
				payload: 'Error'
			})
		).toEqual({
			entries: [],
			labelError: '',
			addressError: 'Error'
		});
	});
});
