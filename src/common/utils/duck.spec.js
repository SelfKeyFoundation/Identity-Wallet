import { createSlice } from '@reduxjs/toolkit';
import { createAliasedSlice } from './duck';

jest.mock('@reduxjs/toolkit', () => ({
	__esModule: true, // this property makes it work
	createSlice: jest.fn()
}));

describe('duck utils', () => {
	afterEach(() => {
		createSlice.mockRestore();
	});
	describe('createAliasedSlice', () => {
		it('should call original createSlice', () => {
			const slice = { name: 'test' };
			const createdSlice = {
				name: 'test',
				actions: {}
			};
			const aliasedSlice = {
				...createdSlice,
				operations: {},
				rawOperations: {}
			};
			createSlice.mockReturnValue(createdSlice);
			const resp = createAliasedSlice(slice);
			expect(createSlice).toHaveBeenCalledWith(slice);
			expect(resp).toEqual(aliasedSlice);
		});

		it('should create aliased operations', () => {});
	});
});
