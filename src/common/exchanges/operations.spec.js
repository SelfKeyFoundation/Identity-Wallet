import operations from './operations';
import * as actions from './actions';

describe('operations', () => {
	it('should export actions', () => {
		expect(operations.updateExchanges).toEqual(actions.updateExchanges);
	});
});
