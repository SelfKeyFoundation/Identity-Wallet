import { testSliceReducer } from '../utils/slice-test';
import { createSlice } from './flow';
import { ParameterValidationError } from 'parameter-validator';

const t = testSliceReducer(createSlice);

describe('flow navigation duck', () => {
	[
		[
			'completeFlow',
			null,
			{ currentFlow: null, flows: [] },
			{
				currentFlow: { test: 'test' },
				flows: []
			}
		],
		['startFlow', {}, ParameterValidationError, { currentFlow: null, flows: [] }]
	].map(params => t(...params));
});
