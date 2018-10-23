import * as actions from './actions';
import * as types from './types';

describe('actions', () => {
	it('should create an action to update gas station data', () => {
		const data = {
			safeLow: 10.0,
			average: 8.0,
			fast: 1.0
		};
		const expectedAction = {
			meta: {
				trigger: types.DATA_UPDATE
			},
			payload: [data],
			type: 'ALIASED'
		};

		expect(actions.updateData(data)).toEqual(expectedAction);
	});
});
