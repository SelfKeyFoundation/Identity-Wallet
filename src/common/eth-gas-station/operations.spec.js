import operations from './operations';
import * as actions from './actions';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { setGlobalContext } from 'common/context';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('operations', () => {
	it('should export actions', () => {
		expect(operations.updateData).toEqual(actions.updateData);
	});

	it('should call updateData action', async () => {
		const store = mockStore({
			transaction: {
				address: ''
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
		const data = {
			safeLow: 10.0,
			average: 8.0,
			fast: 1.0
		};

		const ctx = {
			ethGasStationService: {
				getInfo: () => {
					return data;
				}
			}
		};
		setGlobalContext(ctx);

		const expectedActions = [
			{
				meta: { trigger: 'app/eth-gas-station/UPDATE' },
				payload: [{ average: 8, fast: 1, safeLow: 10 }],
				type: 'ALIASED'
			},
			{ meta: { trigger: 'app/transaction/fee/SET' }, payload: [], type: 'ALIASED' }
		];

		await store.dispatch(operations.loadData());
		expect(store.getActions()).toEqual(expectedActions);
	});
});
